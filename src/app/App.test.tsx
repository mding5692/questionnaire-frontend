import React from 'react';
import * as axios from 'axios';
import { render, screen } from '@testing-library/react';

import App from './App';

jest.mock('axios');

describe('Questionnaire App Frontend', () => {
  test('renders home page', () => {
    render(<App />);
  });
  

})
