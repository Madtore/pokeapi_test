import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { Ability, Pokemon } from '../components/pokemon-details/pokemon-details.component';
import { PokeapiService } from '../core/services/pokeapi.service';

interface PokemonEvolution {
  id: number;
  name: string;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class PokemonDetailService {

  constructor(
    private httpClient: HttpClient,
    private pokeapiService: PokeapiService
  ) { }

  getPokemonDetails(pokemonId: string): Observable<Pokemon> {
    return this.httpClient.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
      .pipe(
        switchMap((pokemonData: any) => {
          return this.httpClient.get(pokemonData.species.url).pipe(
            switchMap((speciesData: any) => {
              const evolutionChainUrl = speciesData.evolution_chain.url;
              const evolutionChainId = evolutionChainUrl.split('/').filter(Boolean).pop();
              
              const abilityRequests = pokemonData.abilities.map((ability: any) => {
                const abilityId = ability.ability.url.split('/').filter(Boolean).pop();
                return this.pokeapiService.getHability(abilityId).pipe(
                  map(abilityData => {
                    const spanishDescription = abilityData.flavor_text_entries
                      .find((entry: any) => entry.language.name === 'es')?.flavor_text || 
                      abilityData.flavor_text_entries[0]?.flavor_text || 'Sin descripción';
                    
                    return {
                      name: ability.ability.name,
                      description: spanishDescription,
                      isHidden: ability.is_hidden
                    };
                  })
                );
              });
              
              return forkJoin({
                evolutionChain: this.pokeapiService.getEvolutionChain(evolutionChainId),
                abilities: forkJoin<Ability[]>(abilityRequests)
              }).pipe(
                map(results => {
                  const pokemon: Pokemon = {
                    id: pokemonData.id,
                    name: pokemonData.name,
                    image: pokemonData.sprites.other['official-artwork'].front_default || 
                           pokemonData.sprites.front_default,
                    types: pokemonData.types.map((type: any) => type.type.name),
                    abilities: results.abilities,
                    evolutionChainId: parseInt(evolutionChainId),
                    weight: pokemonData.weight / 10, 
                    height: pokemonData.height / 10,
                    stats: pokemonData.stats.map((stat: any) => ({
                      name: stat.stat.name,
                      base: stat.base_stat
                    }))
                  };
                  
                  return pokemon;
                })
              );
            })
          );
        }),
        catchError(error => {
          console.error('Error fetching Pokemon details:', error);
          return of(null as unknown as Pokemon);
        })
      );
  }

  getEvolutionChain(chainId: number): Observable<PokemonEvolution[]> {
    return this.pokeapiService.getEvolutionChain(chainId.toString()).pipe(
      map(data => {
        const evolutions: PokemonEvolution[] = [];
        const extractEvolutions = (chain: any) => {
          const id = chain.species.url.split('/').filter(Boolean).pop();
          evolutions.push({
            id: parseInt(id),
            name: chain.species.name,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
          });

          if (chain.evolves_to && chain.evolves_to.length > 0) {
            chain.evolves_to.forEach((evolution: any) => {
              extractEvolutions(evolution);
            });
          }
        };
        
        extractEvolutions(data.chain);
        
        return evolutions;
      }),
      catchError(error => {
        console.error('Error fetching evolution chain:', error);
        return of([]);
      })
    );
  }
}