import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment.prod';

@Component({
  selector: 'app-company',
  imports: [RouterModule, CommonModule],
  templateUrl: './company.html',
  styleUrl: './company.scss',
})
export class Company {
  emailContact: String[] = [];
  numberContact: String[] = [];

  ngOnInit(): void {
    this.emailContact = environment.EMAIL_CONTACT;
    this.numberContact = environment.NUMBER_CONTACT;
  }
}
