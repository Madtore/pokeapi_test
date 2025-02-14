import { Component, Input } from '@angular/core';
export interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
  abilities: Ability[];
  evolutionChainId: number;
}

export interface Ability {
  name: string;
  description: string;
  isHidden: boolean;
}

@Component({
  selector: 'app-pokemon-details',
  standalone: true,
  imports: [],
  templateUrl: './pokemon-details.component.html',
  styleUrl: './pokemon-details.component.scss'
})

export class PokemonDetailsComponent {
  @Input() pokemon: Pokemon | null = null;
  
  
}
