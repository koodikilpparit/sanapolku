import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import PapunetFilterMenu from './PapunetFilterMenu';

describe('PapunetFilterMenu', () => {
  const filters = {
    filter1: 'Filter 1',
    filter2: 'Filter 2',
    filter3: 'Filter 3',
  };
  const selectedFilters = [];
  const onFilterChange = jest.fn();
  window.scrollTo = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the filter menu with default closed state', () => {
    render(
      <PapunetFilterMenu
        filters={filters}
        selectedFilters={selectedFilters}
        onFilterChange={onFilterChange}
      />
    );

    expect(screen.getByText(/valitse kuvatyypit/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/poista kaikki valinnat/i)
    ).not.toBeInTheDocument();
  });

  test('opens and closes the dropdown menu', () => {
    render(
      <PapunetFilterMenu
        filters={filters}
        selectedFilters={selectedFilters}
        onFilterChange={onFilterChange}
      />
    );

    const menuHeader = screen.getByText(/valitse kuvatyypit/i);

    fireEvent.click(menuHeader);
    expect(screen.getByText(/poista kaikki valinnat/i)).toBeInTheDocument();

    fireEvent.click(menuHeader);
    expect(
      screen.queryByText(/poista kaikki valinnat/i)
    ).not.toBeInTheDocument();
  });

  test('selects a filter', () => {
    const filters = { filter1: 'Filter 1', filter2: 'Filter 2' };
    const selectedFilters = [];
    const onFilterChange = jest.fn();

    render(
      <PapunetFilterMenu
        filters={filters}
        selectedFilters={selectedFilters}
        onFilterChange={onFilterChange}
      />
    );

    fireEvent.click(screen.getByText(/valitse kuvatyypit/i));

    const filterOption = screen
      .getByText(/filter 1/i)
      .closest('.filter-option');
    fireEvent.click(filterOption);

    fireEvent.click(screen.getByText(/käytä valintoja/i));
    expect(onFilterChange).toHaveBeenCalledTimes(1);
    expect(onFilterChange).toHaveBeenCalledWith(['filter1']);
  });

  test('handles "Unselect All" functionality', () => {
    render(
      <PapunetFilterMenu
        filters={filters}
        selectedFilters={['filter1', 'filter2']}
        onFilterChange={onFilterChange}
      />
    );

    fireEvent.click(screen.getByText(/valitse kuvatyypit/i));
    const unselectAllButton = screen.getByText(/poista kaikki valinnat/i);

    fireEvent.click(unselectAllButton);
    fireEvent.click(screen.getByText(/käytä valintoja/i));
    expect(onFilterChange).toHaveBeenCalledWith([]);
  });

  test('renders the correct number of filters', () => {
    render(
      <PapunetFilterMenu
        filters={filters}
        selectedFilters={selectedFilters}
        onFilterChange={onFilterChange}
      />
    );

    fireEvent.click(screen.getByText(/valitse kuvatyypit/i));
    const filterOptions = screen.getAllByRole('checkbox');
    expect(filterOptions.length).toBe(Object.keys(filters).length);
  });

  test('renders filter images correctly', () => {
    render(
      <PapunetFilterMenu
        filters={filters}
        selectedFilters={selectedFilters}
        onFilterChange={onFilterChange}
      />
    );

    fireEvent.click(screen.getByText(/valitse kuvatyypit/i));
    Object.keys(filters).forEach((key) => {
      const filterImage = screen.getByAltText(filters[key]);
      expect(filterImage).toHaveAttribute(
        'src',
        `/papunet-img-types/${key}.png`
      );
    });
  });
});
