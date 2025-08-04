export type Season = 'spring' | 'summer' | 'fall' | 'winter';

export type Month = 
  | 'January' 
  | 'February' 
  | 'March' 
  | 'April' 
  | 'May' 
  | 'June' 
  | 'July' 
  | 'August' 
  | 'September' 
  | 'October' 
  | 'November' 
  | 'December';

export type ProduceType = 'fruit' | 'vegetable';

export interface ProduceItem {
  id: number;
  name: string;
  type: ProduceType;
  is_year_round: boolean;
  seasons: number[]; // Season IDs
  availability: number[]; // Month IDs
  all_seasons: number[]; // Season IDs
  season_names?: string[];
  available_months?: Month[];
}

export type ProduceData = ProduceItem[]; 