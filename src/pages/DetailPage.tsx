import styled from '@emotion/styled';
import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import About from '../components/About';
import Evolution from '../components/Evolution';
import PokemonInfo from '../components/PokemonInfo';
import Stats from '../components/Stats';
import Tabs from '../components/Tabs';
import usePokemonQuery from '../hooks/usePokemonQuery';
import useSpeciesQuery from '../hooks/useSpecies';
import { PokemonResponse } from '../types';

// type Params = {
//   id: string;
// }

// const DetailPage: React.FC = () => {
//   const {id} = useParams<Params>();
  
//   return (
//     <div>Detail Page id: {id}</div>
//   )
// }

// export default DetailPage;

type Params = {
  id: string;
}

type Tab  = 'about' | 'stats' | 'evolution';

const Container = styled.section`
  display: flex;
  flex-direction: column;
`;

const TabsWrapper = styled.div`
  margin: 24px auto 0;
`;

const DetailPage: React.FC = () => {
  const { id ='' } = useParams<Params>();

  const [selectedTab, setSelectedTab] = useState<Tab>('about');

  const pokemonQueryResult = usePokemonQuery<PokemonResponse>(id);
  const speciesQueryResult = useSpeciesQuery(id);

  const { name, types, height, weight, abilities, baseExp, stats } = useMemo(() => ({
    name: pokemonQueryResult.data?.data.name,
    types: pokemonQueryResult.data?.data.types,
    height: pokemonQueryResult.data?.data.height,
    weight: pokemonQueryResult.data?.data.weight,
    abilities: pokemonQueryResult.data?.data.abilities,
    baseExp: pokemonQueryResult.data?.data.base_experience,
    stats: pokemonQueryResult.data?.data.stats,
  }), [pokemonQueryResult]);

  const {
    color,
    growthRate,
    flavorText,
    genderRate,
    isLegendary,
    isMythical,
    evolutionChainUrl,
  } = useMemo(() => ({
    color: speciesQueryResult.data?.data.color,
    growthRate: speciesQueryResult.data?.data.growth_rate.name,
    flavorText: speciesQueryResult.data?.data.flavor_text_entries[0].flavor_text,
    genderRate: speciesQueryResult.data?.data.gender_rate,
    isLegendary: speciesQueryResult.data?.data.is_legendary,
    isMythical: speciesQueryResult.data?.data.is_mythical,
    evolutionChainUrl: speciesQueryResult.data?.data.evolution_chain.url,
  }), [speciesQueryResult]);

  const handleTabClick = (tab: Tab) => {
    setSelectedTab(tab);
  }

  return (
    <Container>
      <PokemonInfo
        id={id}
        name={name}
        types={types}
        color={color}
      />
      <TabsWrapper>
        <Tabs
          color={color}
          tab={selectedTab}
          onClick={handleTabClick}
        />
      </TabsWrapper>
      {
        selectedTab === 'about' && (
          <About
            isLoading={pokemonQueryResult.isLoading || speciesQueryResult.isLoading}
            color={color}
            growthRate={growthRate}
            flavorText={flavorText}
            genderRate={genderRate}
            isLegendary={isLegendary}
            isMythical={isMythical}
            types={types}
            weight={weight}
            height={height}
            baseExp={baseExp}
            abilities={abilities}
          />
        )
      }
      {
        selectedTab === 'stats' && (
          <Stats
            isLoading={pokemonQueryResult.isLoading || speciesQueryResult.isLoading}
            color={color}
            stats={stats}
          />
        )
      }
      {
        selectedTab === 'evolution' && (
          <Evolution
            id={id}
            isLoading={speciesQueryResult.isLoading}
            color={color}
            url={evolutionChainUrl}
          />
        )
      }
    </Container>
  )
}

export default DetailPage;