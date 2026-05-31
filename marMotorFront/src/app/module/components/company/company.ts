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

  abrirYCopiarCorreo(email: String) {
    const correoText = email.toString();

    // 1. Copiamos al portapapeles y avisamos al usuario (puedes cambiar el alert por un Toast más adelante)
    navigator.clipboard.writeText(correoText).then(() => {
      alert('¡Correo copiado al portapapeles: ' + correoText + '!\nAbriendo gestor de correo...');
    });

    // 2. El truco definitivo: Crear un enlace "fantasma" en memoria y forzar el clic
    const mailtoLink = document.createElement('a');
    mailtoLink.href = `mailto:${correoText}`;

    // Lo añadimos al documento, lo clicamos y lo destruimos rápidamente
    document.body.appendChild(mailtoLink);
    mailtoLink.click();
    document.body.removeChild(mailtoLink);
  }
}
