import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-plan-confirmation',
  imports: [RouterLink],
  templateUrl: './plan-confirmation.html',
  styleUrl: './plan-confirmation.scss'
})
export class PlanConfirmation {

   constructor(
    private router: Router,
    private location: Location,
  ) {}

   public goBack(): void {
    this.location.back();
  }

}
