import React, { useEffect, useState } from "react";
import Select from "react-select";
import countriesData from "./countries.json"; // Import the JSON file

const CountrySelect = ({ onChange, onBlur, value, invalid }) => {
  const [countries, setCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);

  useEffect(() => {
    // Use the imported JSON data directly
    if (
      countriesData &&
      countriesData.countries &&
      Array.isArray(countriesData.countries)
    ) {
      const countryOptions = countriesData.countries.map((country) => ({
        value: country.label,
        label: country.label,
      }));
      const allOption = { value: "All", label: "All" };
      setCountries([allOption, ...countryOptions]);
    }
  }, []);

  const handleCountryChange = (selectedOptions) => {
    setSelectedCountries(selectedOptions);
    onChange({
      target: {
        name: "byCountry",
        value: selectedOptions ? selectedOptions.map(option => option.label).join(', ') : ''
      }
    });
  };

  return (
    <div>
      <Select
        options={countries}
        placeholder="Select Countries"
        value={selectedCountries}
        onChange={handleCountryChange}
        onBlur={onBlur}
        isMulti
        isClearable={true} // Optionally, make it clearable
        className={invalid ? "is-invalid" : ""}
      />
      {invalid && <div className="invalid-feedback">Please choose at least one country.</div>}
    </div>
  );
};

export default CountrySelect;
