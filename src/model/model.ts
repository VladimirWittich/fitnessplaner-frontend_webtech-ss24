export interface Exercise {
    name: string;
    sets: number[];
    repetitions: number[];
    weight: number[];
    totalWeight: number;
    owner: string; // Neue Eigenschaft ownerEmail hinzugefügt

}
