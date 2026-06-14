export const useDeviceState = () => {
    const isMobile = useState('app-device-is-mobile', () => false);
    return { isMobile };
}