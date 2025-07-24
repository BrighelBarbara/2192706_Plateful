
export type Restriction = {
    type: 'allergy' | 'intolerance'
    ingredient: string
  }
  
  export type Participant = {
    id: number
    name: string
    surname: string
    restrictions: Restriction[]
  }
  
  /**
   * Calcola gli avvisi di allergie o intolleranze in base agli ingredienti e ai partecipanti.
   *
   * @param ingredients Elenco degli ingredienti della proposta
   * @param participants Elenco dei partecipanti con restrizioni
   * @returns Elenco di messaggi di avviso per restrizioni alimentari
   */
  
  export function calculateWarnings(
    ingredients: string[],
    participants: Participant[]
  ): string[] {
    const warnings: string[] = []
  
    participants.forEach(user => {
      const matches = user.restrictions.filter(restriction =>
        ingredients.some(ingredient =>
          ingredient.toLowerCase().includes(restriction.ingredient.toLowerCase())
        )
      )
  
      if (matches.length > 0) {
        const grouped: Record<string, string[]> = {}
  
        matches.forEach(({ type, ingredient }) => {
          if (!grouped[type]) grouped[type] = []
          grouped[type].push(ingredient)
        })
  
        const phrases = Object.entries(grouped).map(([type, items]) => {
          const label = type === 'allergy' ? 'is allergic to' : 'is intolerant to'
          return `${user.name} ${user.surname} ${label}: ${[...new Set(items)].join(', ')}`
        })
  
        warnings.push(...phrases)
      }
    })
  
    return warnings
  }
  