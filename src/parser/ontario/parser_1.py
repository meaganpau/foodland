from bs4 import BeautifulSoup
import json

# Map short month names to full names
MONTH_MAP = {
    "jan": "January","feb": "February", "mar": "March", "apr": "April",
    "may": "May", "jun": "June", "jul": "July", "aug": "August",
    "sep": "September", "oct": "October", "nov": "November", "dec": "December"
}

# Define which months belong to which seasons
SEASON_MONTHS = {
    "winter": ["December", "January", "February", "March"],
    "spring": ["March", "April", "May", "June"],
    "summer": ["June", "July", "August", "September"],
    "fall": ["September", "October", "November", "December"]
}

def get_is_year_round(badges):
    for badge in badges:
        text = badge.get_text(strip=True).lower()
        if "year round" in text:
            return True
    return False

def get_all_seasons(badges, season):
    for badge in badges:
        text = badge.get_text(strip=True).lower()
        if "all season" in text:
            return [season]
    return []

# Helper to normalize month text
def normalize_months(badges, season, is_year_round, is_all_season):
    months = set()
    
    for badge in badges:
        text = badge.get_text(strip=True).lower()
        if "year round" in text or "all season" in text:
            continue
            
        abbr = badge.find_parent("abbr")
        if abbr and abbr.has_attr("title"):
            month_title = abbr["title"].strip()
            # Try to map to full month name
            m3 = month_title[:3].lower()
            months.add(MONTH_MAP.get(m3, month_title))
        else:
            # Try to map badge text
            m3 = text[:3].lower()
            if m3 in MONTH_MAP:
                months.add(MONTH_MAP[m3])
    
    # If year round, include all months
    if is_year_round:
        return sorted(list(MONTH_MAP.values()), key=lambda m: list(MONTH_MAP.values()).index(m))
    
    # If all season, for each month found, add all months from its season
    if is_all_season:
        season = season.lower()
        months.update(SEASON_MONTHS[season])
    
    return sorted(months, key=lambda m: list(MONTH_MAP.values()).index(m))

def scrape_availability_guide():
    with open('source.html', 'r', encoding='utf-8') as file:
        html_content = file.read()
    soup = BeautifulSoup(html_content, "html.parser")
    
    # Dictionary to store unique produce items
    produce_dict = {}
    
    # Find all produce items in the content
    for li in soup.find_all('li'):
        # Skip if this is a navigation item
        if li.find_parent('ul', class_='ontario-margin-top-0-!'):
            continue
            
        # Get produce name (from <a> or text)
        a = li.find('a')
        if not a:
            continue

        # Remove \n and all the extra spaces between words
        name = a.get_text(strip=True)
        name = name.replace("\n", "").replace("?", "").strip()
        while "  " in name:
            name = name.replace("  ", " ")
        key = name.lower()

        # Get all badges (month or year-round)
        badges = li.find_all('span', class_='ontario-badge')
        h2 = li.find_previous('h2')
        if not h2:
            continue
        season = h2.get('id')
        if not season:
            continue
        is_year_round = get_is_year_round(badges)
        all_seasons = get_all_seasons(badges, season)
        months = normalize_months(badges, season, is_year_round, all_seasons)
        
        # Skip if no months found
        if not months:
            continue
        
        # Try to determine the type (Fruit or Vegetable)
        # Look for the nearest h3 that might indicate the type
        h3 = li.find_previous('h3')
        produce_type = h3.get_text(strip=True) if h3 else "Unknown"

        
        # If we've seen this produce before, combine the months
        if key in produce_dict:
            existing_seasons = set(produce_dict[key]["seasons"])
            existing_seasons.update([season])
            produce_dict[key]["seasons"] = sorted(list(existing_seasons))
            existing_months = set(produce_dict[key]["availability"])
            existing_months.update(months)
            produce_dict[key]["availability"] = sorted(list(existing_months))
            produce_dict[key]["is_year_round"] = is_year_round
            existing_all_seasons = set(produce_dict[key]["all_seasons"])
            existing_all_seasons.update(all_seasons)
            produce_dict[key]["all_seasons"] = sorted(list(existing_all_seasons))
        else:
            produce_dict[key] = {
                "name": name,
                "type": produce_type,
                "seasons": [season],
                "availability": months,
                "is_year_round": is_year_round,
                "all_seasons": all_seasons
            }
    
    # Convert dictionary to list
    results = list(produce_dict.values())
    return results

if __name__ == "__main__":
    data = scrape_availability_guide()
    with open('output.json', 'w', encoding='utf-8') as file:
        json.dump(data, file, indent=2)

