import React from 'react';
import Banner from '../components/home/Banner';
import NotificationScroll from '../components/home/NotificationScroll';
import About from '../components/home/About';
import Events from '../components/home/Events';
import HomeImages from '../components/home/HomeImages';

const HomePage = () => {
  return (
    <main>
      <Banner />
      <NotificationScroll />
      <About />
      <Events />
      <HomeImages />
    </main>
  );
};

export default HomePage;