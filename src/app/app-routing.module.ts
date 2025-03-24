import { NgModule } from '@angular/core';
import { AsyncPipe, NgIf, NgStyle,NgClass } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './shared/services';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { TvprogramComponent } from './pages/My/tvprogram/tvprogram.component';
import { DxDataGridModule, DxFormModule,  DxPopupModule, DxSchedulerModule, DxSwitchModule, DxTextBoxModule, } from 'devextreme-angular';
import { DxButtonModule, DxTextAreaModule,DxProgressBarModule,DxHtmlEditorModule, } from 'devextreme-angular';
import { DxSelectBoxModule } from 'devextreme-angular/ui/select-box';
import { OpenAiFormComponent } from './shared/openAI/Gemini/Gemini.component';
import { SpeechModule } from './services/speech/speech/speech.module';
import { MyScheduleComponent } from './pages/My/my-schedule/my-schedule.component';
import { SafeUrlPipe } from "./services/common/safe-url.pipe";





const routes: Routes = [
  {
    path: 'programs',
    component: TvprogramComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'events',
    component: MyScheduleComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'gemini',
    component: OpenAiFormComponent,
    canActivate: [AuthGuardService],
  },
  
  
  // {
  //   path: 'openAiTest',
  //   component: OpenAiFormComponent,
  //   canActivate: [AuthGuardService],
  // },
  //   {
  //   path: 'speechTest',
  //   component: WebSpeechComponent,
  //   canActivate: [AuthGuardService],
  // },

    {
    path: '**',
    redirectTo: 'programs'
   }
]


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true }),
    DxDataGridModule, DxSelectBoxModule, DxFormModule, AsyncPipe, DxPopupModule, DxSchedulerModule,
    DxButtonModule, DxProgressBarModule, DxSwitchModule, DxTextBoxModule, DxTextAreaModule,
    SpeechModule, DxHtmlEditorModule, NgIf,NgStyle,NgClass,
    SafeUrlPipe,  
],
  providers: [AuthGuardService ],
  exports: [RouterModule],
  
  declarations: [
    HomeComponent,
    ProfileComponent,
    MyScheduleComponent,
    OpenAiFormComponent,
    
  ]
})
export class AppRoutingModule { }
