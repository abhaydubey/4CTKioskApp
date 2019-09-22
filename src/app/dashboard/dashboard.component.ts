import { Router } from '@angular/router';

import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import * as $ from 'jquery';


const passwordRegEx = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&#])[A-Za-z\d$@$!%*?&#].{8,}';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  title: string = 'Services';
 
  constructor(private router: Router) {
    
    this.title = 'Services';
  }
  ngOnInit(){
    
  }


  cafeteriaClick(){
    this.router.navigateByUrl('tabs/tabs/home');
  }
  

}
