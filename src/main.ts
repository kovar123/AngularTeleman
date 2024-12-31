import themes from 'devextreme/ui/themes';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

//#region  licencjonowanie
import { licenseKey } from './devextreme-license'; 
import config  from 'devextreme/core/config';
config({licenseKey});
//#endregion

themes.initialized(() => {
  platformBrowserDynamic().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true,
})
    .catch(err => console.error(err));
});

