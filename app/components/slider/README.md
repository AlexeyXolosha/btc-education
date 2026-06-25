# Slider

Кастомный слайдер на нативном drag (Pointer Events) и CSS-трансформациях, без сторонних библиотек. Логика разнесена по composables, разметка — по шаблонам, которые подгружаются динамически под устройство (desktop/mobile). Полностью SSR-safe.

## Содержание
- [Схема](#схема)
- [Поток данных](#поток-данных)
- [Разбор кода](#разбор-кода)
- [Public API](#public-api)
- [Жесты и поведение](#жесты-и-поведение)
- [SSR](#ssr)
- [Что нужно сделать (Roadmap)](#что-нужно-сделать-roadmap)

## Схема

```
┌─────────────────────────────────────────────────────────────┐
│  Страница / родитель                                         │
│  <slider-component template="custom" :items :autoplay …>     │
│      <template #slide="{ item }"> … </template>              │
└───────────────┬─────────────────────────────────────────────┘
                │ props (fallthrough) + слоты
                ▼
┌─────────────────────────────────────────────────────────────┐
│  slider/component.vue        (обёртка-загрузчик)             │
│  • useLoaderComponent('slider', template)                    │
│  • выбирает desktop.vue / mobile.vue по устройству           │
│  • ЯВНО форвардит слоты вниз (важно!)                         │
└───────────────┬─────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│  templates/custom/desktop.vue   (сборка слайдера)           │
│  разметка: .slider › .slider-wrapper › .slider-item[]        │
│            + пагинация + стрелки                              │
│                                                              │
│  собирает composables:                                       │
│  ┌────────────────┐ ┌────────────┐ ┌──────────────┐         │
│  │ useSliderCore  │ │ useDrag    │ │ useAutoplay  │         │
│  │ позиция/индекс │ │ драг+ось   │ │ таймер       │         │
│  └───────┬────────┘ └─────┬──────┘ └──────┬───────┘         │
│          │   ┌────────────┴────┐          │                 │
│          │   │ useNavigation   │   ┌──────┴─────────┐       │
│          │   │ usePagination   │   │ useReducedMotion│      │
│          │   └─────────────────┘   └────────────────┘       │
│          └── translate / currentIndex / maxIndex ──┐        │
└────────────────────────────────────────────────────┼────────┘
                                                      ▼
                                  CSS transform: translateX(var)
```

## Поток данных

```
ДЕЙСТВИЕ ПОЛЬЗОВАТЕЛЯ          ОБРАБОТЧИК            ЯДРО
─────────────────────────────────────────────────────────────
drag (горизонт.)  ─pointer──▶ useDrag.onMove ─────▶ translate
отпускание        ─pointerup▶ useDrag.onUp ───────▶ goTo(round)
клик по стрелке   ─click────▶ onPrev/onNext ──────▶ prev/next ─▶ goTo
клик по буллету   ─click────▶ onSelect ───────────▶ goTo
autoplay tick     ─timer────▶ next / goTo(0) ─────▶ goTo
resize / items++  ─observer─▶ measure ────────────▶ slideStep, maxIndex

goTo(i) ──▶ currentIndex = clamp(i) ──▶ applyTranslate(i)
        └─▶ emit('update:modelValue') + emit('slide-change')

любая ручная навигация ──▶ resetAutoplay()  (таймер с нуля)
старт drag             ──▶ stopAutoplay()
конец drag             ──▶ startAutoplay()
```

## Разбор кода

### `slider/component.vue` — обёртка-загрузчик
Тонкая прослойка. Через `useLoaderComponent('slider', template)` выбирает шаблон по типу устройства (`desktop.vue`/`mobile.vue`) и рендерит его. Делает две вещи, без которых слайдер не работает:

```vue
<component :is="currentComponent">
  <template v-for="(_, name) in $slots" #[name]="slotProps">
    <slot :name="name" v-bind="slotProps ?? {}" />
  </template>
</component>
```

> ⚠️ **Форвардинг слотов обязателен.** `$attrs` (`items`, `autoplay`, …) проваливаются в дочерний компонент автоматически, а слоты — **нет**. Без этого блока `#slide` не доходит до шаблона и слайды рендерятся пустыми.

`provide('useParent', { apiURL })` отдаёт базовый URL вниз — это специфика проекта, к ядру слайдера отношения не имеет.

### `templates/custom/desktop.vue` — сборка слайдера
Разметка + склейка composables. Корневой `.slider` несёт inline CSS-переменные `--spv` (slides per view) и `--sw-gap`, по которым CSS считает ширину слайда:

```scss
.slider-item {
  flex: 0 0 calc((100% - (var(--spv) - 1) * var(--sw-gap)) / var(--spv));
}
```

Ключевые места:
- `@mouseenter/@mouseleave` → пауза autoplay на ховере.
- `.slider-wrapper` несёт `transform: translateX(translate)` и `touch-action: pan-y`.
- Навигационные обёртки `onNext/onPrev/onSelect` навигируют **и** сбрасывают autoplay (`resetAutoplay`).
- Пагинация и стрелки рендерятся под `v-if="pagination"` / `v-if="navigation"`. Пагинация ещё ждёт `mounted`, чтобы не было SSR-расхождения по числу буллетов.

### `useSliderCore(wrapper, props, emit)` — ядро
Состояние и навигация. Главные величины:
- `translate` — текущий сдвиг в px (идёт в CSS `translateX`).
- `currentIndex` / `maxIndex` — активный слайд и максимум.
- `slideStep` — ширина слайда + gap (шаг).

Методы:
- `measure()` — меряет геометрию: `slideStep` из первого слайда, `maxTranslate` из `scrollWidth − clientWidth`, `maxIndex`. Поджимает `currentIndex`, если слайдов стало меньше.
- `goTo(i)` — кламп индекса, сдвиг, эмит `update:modelValue` + `slide-change`.
- `next()` / `prev()`.

Реакция на изменения:
- `ResizeObserver` → `measure` при ресайзе.
- `watch(() => props.items?.length, () => nextTick(measure))` → пересчёт при асинхронной подгрузке/смене числа слайдов.

### `useDrag({ wrapper, translate, isDragging, slideStep, onStart, onSettle })` — драг + лок оси
Перетаскивание на Pointer Events (мышь + тач одним кодом) с **определением оси по первому движению** (порог `AXIS_THRESHOLD = 8px`):
- Пока ось не ясна — pointer не захватывается, `isDragging` не ставится.
- Первое движение по **X** → захват, `isDragging = true`, `onStart()` (стоп autoplay), далее двигаем `translate`.
- Первое движение по **Y** → выходим (`pointerId = null`), вертикальный скролл страницы остаётся у браузера.
- `onUp` → если был драг, `onSettle(round(-translate/slideStep))` (снап к ближайшему слайду).
- `onClickCapture` гасит «ложный» клик после драга (`moved`), чтобы перетаскивание не сработало как клик по слайду.

### `useAutoplay(autoplay, { currentIndex, maxIndex, next, goTo, reducedMotion })` — автопрокрутка
Таймер. Конфиг: `true` → дефолты `{ delay: 4000, pauseOnHover: true }`, либо объект-переопределение.
- `start()` — не стартует при выключенном autoplay, `prefers-reduced-motion` или уже идущем таймере. Дойдя до `maxIndex`, возвращается к `0`.
- `stop()` / `reset()` (= stop+start, перезапуск с нуля).
- `onHoverPause/onHoverResume` — для ховера.
- Сам слушает `visibilitychange` — на неактивной вкладке стоп, при возврате старт.

### `usePagination({ currentIndex, maxIndex, goTo })`
`bullets` — массив `[0..maxIndex]`, `isActive(i)`, `select(i) → goTo(i)`.

### `useNavigation({ currentIndex, maxIndex, prev, next })`
`canPrev` / `canNext` — для `:disabled` на стрелках (на краях кнопка гаснет).

### `useReducedMotion()`
Реактивный `ref<boolean>` по `prefers-reduced-motion: reduce`. Используется, чтобы глушить autoplay.

## Public API

### Props
| Prop            | Тип                 | По умолчанию | Описание |
|-----------------|---------------------|--------------|----------|
| `items`         | `Array`             | `[]`         | Данные слайдов (`v-for`). |
| `slidesPerView` | `Number \| String`  | `2`          | Сколько слайдов видно одновременно. |
| `gap`           | `Number`            | `16`         | Отступ между слайдами, px. |
| `column`        | `Boolean`           | `false`      | Вертикальная ось. Требует CSS-переменную `--sw-item-h` у потребителя (см. [Column-режим](#column-режим-вертикальный-и-высота-viewport)). |
| `autoplay`      | `Boolean \| Object` | `false`      | `true` или `{ delay, pauseOnHover }`. |
| `pagination`    | `Boolean`           | `true`       | Показывать буллеты. |
| `navigation`    | `Boolean`           | `true`       | Показывать стрелки. |
| `template`      | `String`            | `'default'`  | На обёртке: какой шаблон грузить. |

### Slots
| Slot    | Scope             | Описание |
|---------|-------------------|----------|
| `slide` | `{ item, index }` | Шаблон одного слайда. |

### Events
| Event               | Payload         | Когда |
|---------------------|-----------------|-------|
| `update:modelValue` | `index: Number` | Смена слайда (поддерживает `v-model`). |
| `slide-change`      | `index: Number` | То же, отдельным именем. |

### Пример
```vue
<slider-component
  template="custom"
  :items="products"
  :slides-per-view="1"
  :gap="16"
  :autoplay="{ delay: 4000, pauseOnHover: true }"
  :navigation="!isMobile"
>
  <template #slide="{ item, index }">
    <img :src="item.image" :alt="item.title" @dragstart.prevent>
  </template>
</slider-component>
```

## Жесты и поведение
- **Горизонтальный свайп/драг** — листает слайдер.
- **Вертикальный свайп** — скроллит страницу (слайдер не вмешивается; `touch-action: pan-y` + лок оси).
- **Drag во время autoplay** — autoplay стоп на старте драга, старт заново на отпускании.
- **Ручная навигация** (стрелки/буллеты) — сбрасывает таймер autoplay.
- **Ховер** (десктоп) — пауза autoplay (если `pauseOnHover`).
- **Неактивная вкладка** — autoplay стоп.
- **`prefers-reduced-motion`** — autoplay полностью выключен.

## SSR
Слайдер SSR-safe: `document`/`matchMedia`/`ResizeObserver` трогаются только внутри `onMounted`. `slidesPerView`/`gap` отдаются inline-переменными (рендерятся на сервере), поэтому первый кадр сразу корректный, без layout-shift и без генерации `<style>` на инстанс. Пагинация ждёт `mounted`, чтобы число буллетов не разошлось между сервером и клиентом.

## Column-режим (вертикальный) и высота viewport

Проп `column` переключает слайдер в вертикальную ось: `.slider-wrapper` становится `flex-direction: column`, сдвиг идёт через `translateY`, стрелки переставляются через `order` и иконки поворачиваются на 90°. Используется, например, в галерее товара (`product-detail-parts/.../content/desktop.vue` — лента миниатюр).

### Высота viewport считается чистым CSS (без прыжка)

Viewport в column-режиме должен показывать ровно `slidesPerView` слайдов и обрезать остальное по `overflow`. Раньше высота бралась из JS-измерения (`offsetHeight` первого слайда) и проставлялась inline-стилем **после** `onMounted` → первый кадр был без высоты, затем JS её проставлял → **layout-shift (прыжок)**.

Теперь высота считается из CSS-переменных и присутствует уже в первом рендере (SSR + гидрация), поэтому прыжка нет:

```scss
.is-column .slider-viewport {
  height: calc(var(--sw-item-h) * var(--spv) + var(--sw-gap, 16px) * (var(--spv) - 1));
}
```

`--spv` и `--sw-gap` уже задаются обёрткой (`useBreakpoints`), а высоту одного слайда **`--sw-item-h` обязан задать потребитель**:

```scss
.miniature-slide {
  --sw-item-h: 76px;   // высота слайда; без неё calc() невалиден и viewport схлопнется
}
```

> ⚠️ **Условие применимости:** подход работает, только когда высота слайда фиксирована и известна в CSS. Это осознанный компромисс: посчитать высоту без JS нельзя, не зная высоту элемента. Дефолта у `--sw-item-h` намеренно нет — чтобы забытая переменная сразу бросалась в глаза, а не подставляла молча неверную высоту.

`useSliderCore.measure()` для прокрутки берёт реальную высоту viewport (`parentElement.clientHeight`) — симметрично горизонтальному случаю (`clientWidth`). JS-расчёт высоты viewport (бывший `viewSize`) полностью удалён.

## Что нужно сделать (Roadmap)

Отсортировано по приоритету. Отмечено, что уже сделано.

### Готово
- [x] **Разделение жестов на тач-устройствах** — `touch-action: pan-y` + лок оси в `useDrag`.
- [x] **Re-measure при изменении `items`** — `watch` по длине в `useSliderCore`.
- [x] **Сброс autoplay при ручной навигации** — `resetAutoplay` в обёртках `onNext/onPrev/onSelect`.

### Высокий приоритет
- [ ] **Доступность (a11y):**
  - `role="group"` / `aria-roledescription="carousel"` на контейнере, `aria-roledescription="slide"` на слайдах.
  - `aria-hidden` для слайдов вне экрана.
  - Видимая кнопка паузы autoplay (WCAG 2.2.2 — авто-движение должно ставиться на паузу).
  - Live-регион, объявляющий смену слайда скринридеру.
- [ ] **Управление с клавиатуры** — стрелки ←/→, `tabindex`/фокус на регионе.

### Средний приоритет
- [ ] **Loop / бесконечная прокрутка** — клонирование слайдов или модульная арифметика (самое крупное архитектурно).
- [ ] **`slidesPerGroup`** — листать по N слайдов, а не по одному.
- [ ] **Rubber-band на краях** — сопротивление при драге за границы (сейчас отскок только на отпускании).
- [ ] **Программный API** — `defineExpose({ next, prev, goTo })` для управления извне.
- [ ] **Responsive `breakpoints`** — менять `slidesPerView`/`gap` по ширине. Подход: считать `slidesPerView` в JS через уже имеющийся `ResizeObserver` и отдавать в ту же inline-переменную `--spv` (без генерации CSS и уникального класса).

### Nice-to-have
- [ ] Lazy-load картинок (важно для LCP в hero/каталоге).
- [ ] Прогресс-бар autoplay.
- [ ] RTL-режим.
- [ ] Free mode с инерцией.
- [ ] Синхронизация двух слайдеров / превью-миниатюры.
- [ ] Управление колесом мыши (mousewheel).
- [ ] Центрирование активного слайда.

## Шаблон `default` vs `custom`
- `custom/desktop.vue` — собственная реализация (этот слайдер).
- `default/desktop.vue` — обёртка над [Swiper](https://swiperjs.com/) с пагинацией, используется в hero как альтернатива.

Выбор — через проп `template` на `<slider-component>`.
```

