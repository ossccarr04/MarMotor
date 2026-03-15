import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GaleryDynamic } from '../galery-dynamic/galery-dynamic';
import { Filters } from '../filters/filters';
import { Header } from '../header/header';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule, GaleryDynamic, Filters],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {


}
