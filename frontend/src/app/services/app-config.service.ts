import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface RuntimeConfig {
  apiUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  private apiUrlValue = environment.apiUrl;

  get apiUrl(): string {
    return this.apiUrlValue;
  }

  async load(): Promise<void> {
    if (!environment.production) {
      return;
    }

    const response = await fetch('/config.json');

    if (!response.ok) {
      throw new Error(`Não foi possível carregar config.json (${response.status})`);
    }

    const config: RuntimeConfig = await response.json();

    if (!config.apiUrl) {
      throw new Error('config.json não contém apiUrl');
    }

    this.apiUrlValue = config.apiUrl.replace(/\/$/, '');
  }
}
