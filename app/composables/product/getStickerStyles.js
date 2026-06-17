const DEFAULT_STYLE = { backgroundColor: '#ccc' };

const STICKER_STYLES = {
    'Хит': { backgroundColor: '#2992d9' },
    'Акция': { backgroundColor: '#0E6CDD'},
    'Советуем': { backgroundColor: '#893ca9'},
    'Новинка': { backgroundColor: '#FB6340'}
};

export function getStickerStyles(name) {
    return STICKER_STYLES[name] || DEFAULT_STYLE;
}