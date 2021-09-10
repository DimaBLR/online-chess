import { HeaderApp } from "./header/header";
import { MainApp } from "./main/main";

export class Router {
  header: HeaderApp;

  main: MainApp;

  constructor(header:HeaderApp, main:MainApp) {
    this.header = header;
    this.main = main;
    window.onpopstate = () => { this.getRoute(); };
    this.getRoute();
  }

  getRoute() {
    
    this.header.arrLinks.forEach((el) => {
      location.hash == el.getAttribute('href')
        ? el.classList.add('link-active')
        : el.classList.remove('link-active');
    });
    if (location.hash == '') this.header.arrLinks[0].classList.add('link-active');
    
    const currentRouteName: string = window.location.hash.slice(1);

    const defaultRoute = {
      name: 'lobby',
      component: () => {
        this.viewLobby();
      },
    };
    const routing = [
      {
        name: 'statistics',
        component: () => {
          this.viewStatistics();
          this.loadStatistics()
        },
      },
    ];
    const currentRoute = routing.find((p) => p.name === currentRouteName);
    (currentRoute || defaultRoute).component();
  }

  viewLobby() {}
  viewStatistics() {}
  loadStatistics() {}
}
