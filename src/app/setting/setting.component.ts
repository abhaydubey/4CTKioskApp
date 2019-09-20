

import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goHome() {
    // this.router.navigate(['/']);
  }

}

