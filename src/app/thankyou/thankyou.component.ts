import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.scss'],
})
export class ThankyouComponent implements OnInit {

  constructor(private authService: AuthenticationService, private router: Router) {
  }
  

  


  ngOnInit() {
    let that= this;
    
    setTimeout(()=>that.router.navigateByUrl('dashboard'),5000);
    that.authService.logout();
  }

 
  

  




  

  






}
