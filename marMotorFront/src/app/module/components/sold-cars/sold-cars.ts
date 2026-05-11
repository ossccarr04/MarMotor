import { CommonModule, TitleCasePipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CarServiceBBDD } from '../../services/car-service-bbdd';
import { BadgeLabel, BadgeType } from '../../../@types/enums/badge.enum';
import { CarDTO } from '../../../@types/interface/car.interface';

@Component({
  selector: 'app-sold-cars',
  standalone: true,
  imports: [CommonModule, TitleCasePipe],
  templateUrl: './sold-cars.html',
  styleUrl: './sold-cars.scss',
})
export class SoldCars implements OnInit {
  private carService = inject(CarServiceBBDD);
  private cdr = inject(ChangeDetectorRef);

  public cargando = true;
  public cochesVendidos: CarDTO[] = [];
  public badgeLabel = BadgeLabel;
  public badgeType = BadgeType;

  ngOnInit(): void {
    this.cargarCochesVendidos();
  }

  cargarCochesVendidos(): void {
    this.cargando = true;
    this.carService.getCars().subscribe({
      next: (data) => {
        const SOLD_BADGE = String(this.badgeType.SOLD).toUpperCase();
        this.cochesVendidos = (data || []).filter(
          (coche) => coche.badge && coche.badge.trim().toUpperCase() === SOLD_BADGE,
        );
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar los coches vendidos:', err);
        this.cargando = false;
      },
    });
  }

  getBadgeText(badge: any): string {
    if (!badge) return '';
    const badgeKey = badge ? (String(badge).trim().toLowerCase() as BadgeType) : BadgeType.NONE;
    if (Object.values(this.badgeType).includes(badgeKey)) {
      return this.badgeLabel[badgeKey as BadgeType];
    }
    return badge ? badge.toString() : '';
  }
}
