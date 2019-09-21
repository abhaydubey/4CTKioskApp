
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsRoutingModule } from './tabs.router.module';

import { TabsComponent } from './tabs.component';

@NgModule({
  imports: [
    
    CommonModule,
    FormsModule,
    TabsRoutingModule
  ],
  declarations: [TabsComponent]
})
export class TabsModule {}
