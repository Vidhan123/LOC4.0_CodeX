import React from 'react';
import Particles from 'react-tsparticles';

export default function Particle() {
  return (
    <Particles 
        height={'99vh'}
        params={{
          'particles': {
                'line_linked': {
                    'enable': true,
                    'distance': 100,
                    'color': '#3F3D56',
                    'opacity': 0.5,
                    'width': 1
                },
              'number': {
                  'value': 85
              },
              'size': {
                  'value': 5
              },
              'color': {
                  'value': '#3f51b5',
              },
              'move': {
                direction: "none",
                enable: true,
                outMode: "bounce",
                random: false,
                speed: 1,
                straight: false,
              },
          },
          'interactivity': {
              'events': {
                  'onhover': {
                      'enable': true,
                      'mode': 'repulse'
                  }
              }
          }
        }} 
      />
  )
};