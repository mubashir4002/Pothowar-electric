import React from 'react';
import { IconBulb, IconWind, IconSolarPanel, IconPlug } from '@tabler/icons-react';
import './Categories.css';

const categories = [
  { id: 1, name: 'LED Lights', icon: <IconBulb size={32} /> },
  { id: 2, name: 'Fans', icon: <IconWind size={32} /> },
  { id: 3, name: 'Solar', icon: <IconSolarPanel size={32} /> },
  { id: 4, name: 'DB Boxes', icon: <IconPlug size={32} /> },
];

const Categories = () => {
  return (
    <section className="categories-section">
      <div className="container">
        <h2 className="section-title">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 cats-grid">
          {categories.map(cat => (
            <div key={cat.id} className="cat-card hover-scale">
              <div className="cat-icon">{cat.icon}</div>
              <div className="cat-name">{cat.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
