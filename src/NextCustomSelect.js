// NextCustomSelect.js
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './NextCustomSelect.module.css';

const NextCustomSelect = ({ options, selected, customClasses, onSelect, placeholder }) => {
  const [currentSelected, setCurrentSelected] = useState(selected);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const selectRef = useRef(null);

  const customSelectClasses = [styles.CustomSelect];
  if (customClasses) customSelectClasses.push(customClasses);

  const handleSelect = (value) => {
    setCurrentSelected(value);
    setOptionsOpen(false);
    if (onSelect) onSelect(value);
  };

  const handleOpenOptions = () => {
    setOptionsOpen(!optionsOpen);
  };

  // Handle clicks outside of the select to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setOptionsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getSelectedOptionName = () => {
    const selectedOption = options.find(option => option.value === currentSelected);
    return selectedOption ? selectedOption.name : placeholder;
  };


  const [filteredOptions, setFilteredOptions] = useState(options);
  const [filterStr, setFilterStr] = useState('');

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  const filterOptions = (e) => {
    setFilterStr(e.target.value);
    setFilteredOptions(options.filter(o => o.name.toLowerCase().includes(e.target.value.toLowerCase())));
  };


  return (
    <div ref={selectRef} className={`${customSelectClasses.join(' ')} ${optionsOpen ? styles.optionsOpen : ""}`}>
      <div onClick={handleOpenOptions} className={styles.selectedValue}>
        <input
          type="text"
          placeholder={getSelectedOptionName()}
          value={filterStr}
          onChange={filterOptions}
        />
        <svg id={styles.selectIcon} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 12 12">
          <path d="M6 8.825c-.2 0-.4-.1-.5-.2l-3.3-3.3c-.3-.3-.3-.8 0-1.1c.3-.3.8-.3 1.1 0l2.7 2.7l2.7-2.7c.3-.3.8-.3 1.1 0c.3.3.3.8 0 1.1l-3.2 3.2c-.2.2-.4.3-.6.3Z"></path>
        </svg>
      </div>


      {optionsOpen && (
        <ul role="listbox">
          {
            filteredOptions && filteredOptions.length > 0
              ? filteredOptions.map((option) => (
                <li
                  key={option.value}
                  className={currentSelected === option.value ? styles.selected : ""}
                  value={option.value}
                  onClick={() => handleSelect(option.value)}
                  role="option"
                >
                  {option.name}
                </li>
              ))
              : <li>No options found</li>
          }
        </ul>
      )}
    </div>
  );
};

NextCustomSelect.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })),
  selected: PropTypes.string,
  customClasses: PropTypes.string,
  onSelect: PropTypes.func,
  placeholder: PropTypes.string,
};

NextCustomSelect.defaultProps = {
  options: [],
  selected: null,
  customClasses: '',
  onSelect: null,
  placeholder: '',
};


export default NextCustomSelect;