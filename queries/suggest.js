export default (instanceOf = 'Q515', limit = 10, lang = 'ckb') => {
  const query = `
    # TOP 100 missing articles about cities by site link count

    # We use 'as' to add an alias (change the name of the variable)
    SELECT (?e as ?id) ?name ?linkCount ?image ?description WHERE {
        # The entity is a city
        ?e wdt:P31 wd:${instanceOf} ;
            wdt:P18 ?image ;
        # Get number of links (wikipedia languages)
        wikibase:sitelinks ?linkCount.
    
        # Get description of the entity
        ?e schema:description ?description.
        FILTER ( lang(?description) = "en" )
    
        # Get label for the entity
        ?e rdfs:label ?name.
        
        # Only get the english label
        FILTER((LANG(?name)) = "en")
        
        # Don't inclue the entities that ❌
        MINUS {
            # Have articles on sorani wikipedia
            ?article schema:about ?e;
            schema:isPartOf <https://${lang}.wikipedia.org/>.
        }
    
    
        FILTER(?linkCount >= 25) # Should have at least 25 links
    }
    GROUP BY ?e ?name ?linkCount ?image ?description
    ORDER BY DESC (?linkCount) # Sort by number of links, from highest to lowest
    LIMIT ${limit} # Only get top 100
`;
  return query;
};
