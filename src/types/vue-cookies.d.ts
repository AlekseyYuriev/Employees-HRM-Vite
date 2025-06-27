declare module "vue-cookies" {
  interface VueCookies {
    VueCookies: any;
    get(key: string): string | null;
    set(key: string, value: string, expireTimes?: string | Date): void;
    remove(key: string): void;
  }
  const VueCookies: VueCookies;
  export default VueCookies;
}
