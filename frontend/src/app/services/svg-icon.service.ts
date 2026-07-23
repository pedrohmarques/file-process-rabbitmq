import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import icons from './icons.json'
@Injectable({
  providedIn: 'root'
})
export class SvgIconService {

  private readonly icons = icons;


  constructor(
    private readonly iconRegistry: MatIconRegistry,
    private readonly sanitizer: DomSanitizer
  ) {}


  registerIcons(): void {
    this.icons.forEach(icon => {
      this.iconRegistry.addSvgIcon(
        icon.name,
        this.sanitizer.bypassSecurityTrustResourceUrl(
          icon.path
        )
      );
    });
  }
}