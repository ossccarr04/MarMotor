import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Filters } from '../common/filters/filters';
import { GaleryDynamic } from '../common/galery-dynamic/galery-dynamic';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule, Filters, GaleryDynamic],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {


}
