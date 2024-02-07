import { render, screen } from '@testing-library/react';
import { it, describe, expect } from 'vitest';
import Map from './map';

describe(`Map`, () => {
  it(`renders a Map component`, () => {
    render(<Map />);

    expect(screen.getByText(`Test Map`)).toBeInTheDocument();
  });
});
