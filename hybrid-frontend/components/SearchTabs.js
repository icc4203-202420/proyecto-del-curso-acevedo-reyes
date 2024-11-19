import React, { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import BarsList from '../app/bars/BarsList';
import BeersList from '../app/beers/BeersList';
import ProfilesList from '../app/users/ProfilesList';

const FirstRoute = ({ searchKeywords, isActive}) => (
  <BarsList searchKeywords={searchKeywords} isActive={isActive} />
);

const SecondRoute = ({ searchKeywords, isActive }) => (
  <BeersList searchKeywords={searchKeywords} isActive={isActive} />
);

const ThirdRoute = ({ searchKeywords, isActive }) => (
  <ProfilesList searchKeywords={searchKeywords} isActive={isActive} />
);

function SearchTabs({ searchKeywords, setSearchKeywords }) { 
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'Bares' },
    { key: 'second', title: 'Cervezas' },
    { key: 'third', title: 'Perfiles' },
  ]);

  const renderScene = SceneMap({
    first: () => <FirstRoute searchKeywords={searchKeywords} isActive={index === 0} />,
    second: () => <SecondRoute searchKeywords={searchKeywords} isActive={index === 1} />,
    third: () => <ThirdRoute searchKeywords={searchKeywords} isActive={index === 2}/>,
  });

  return (
    <TabView
      navigationState = {{ index, routes }}
      renderScene     = {renderScene}
      onIndexChange   = {setIndex}
      initialLayout   = {{ width: layout.width }}
    />
  );
}

export default SearchTabs;
