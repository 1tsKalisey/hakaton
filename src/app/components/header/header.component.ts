import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="container">
        <nav class="nav">
          <div class="nav-brand">
            <h1>Clima App</h1>
          </div>
          <div class="nav-links">
            <a
              routerLink="/"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: true }"
            >
              Inicio
            </a>
            <a routerLink="/favorites" routerLinkActive="active">
              Favoritos
              @if (favoritesCount() > 0) {
              <span class="badge">{{ favoritesCount() }}</span>
              }
            </a>
          </div>
          <div class="language-selector">
            <!-- Se quita el selector de idiomas -->
          </div>
        </nav>
      </div>
    </header>
  `,
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly favoritesService = inject(FavoritesService);

  protected readonly favoritesCount = this.favoritesService.favoritesCount;
}
    