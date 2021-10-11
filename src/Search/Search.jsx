import { useEffect, useRef, useState, useReducer } from "react";
import styled from "styled-components";
import currencies from "./currency";
import useEventListener from "./useListener";

//TODO:
//# change input for everyfing for spans and inputs
//# spans will be filter names, input values
//# butt all that wihtout frame - and fame will be global for section
//# filter names x for close
//# backspace deletes content from input, and the next delete filter name
//# after add filter from actualfilter - create next input and reset actual
//# after fill actual create div from value for filter name and create next input

const notices = [
  "type ISIN, currency, price ... - activate search filter",
  "press arrow keys <-- or --> to activate filter start with and end with",
  "press &, |, ~ or type AND, OR, NOT to add next search filter",
  "press Enter to accept, press ESC to cancel and close selecting dropbox"
];

const operator = ["+", "-", "|", "AND", "OR", "NOT"];

const keys = [];

const data = [
  "ISIN",
  "ISSN",
  "ISBN",
  "trade data",
  "currency",
  "price",
  "quantity",
  "national",
  "ammonunt"
];

const filters = {
  currency: ["EUR", "USD", "GBP", "PLN"]
};

const useDetect = () => {
  return true;
};

const Tips = ({ tip }) => <span></span>;

const Tags = styled.div`
  display: flex;

  > div,
  > input {
    display: inline-flex;
    width: fit-content;
  }
  > div {
    border-radius: 5px;
    border: 1px solid #ccc;
  }
`;

const Notice = styled.div``;

const Filter = styled.div``;

const DropDownWrapper = styled.div`
  position: absolute;
  top: 30px;
  border: 1px solid #ddd;
  left: 20px;
  span {
    font-size: 0.6em;
    opacity: 0.5;
    display: block;
    text-align: left;
    padding: 1em 0 0;
  }
  ul {
    width: 30vw;
  }
  li {
    list-style: none;
    text-align: left;
    &.selected {
      background: #aaa;
    }
  }
`;

const DropDown = ({ values, selected }) => {
  // const classes =
  return (
    <DropDownWrapper>
      <span>use arrow down and up to navigate</span>
      <span>press Enter to slect</span>
      <ul>
        {values &&
          values.map((value, index) => (
            <li className={selected === value && "selected"} key={value}>
              {value}
            </li>
          ))}
      </ul>
    </DropDownWrapper>
  );
};

const SearchWrapper = styled.div`
  position: relative;
  border: 1px solid #ccc;
  input {
    width: 90vw;
    height: 30px;
    outline: none;
    border: none;
  }
`;

let no = 0;

export default () => {
  const searchRef = useRef();
  const [filteredValues, fillFilteredValues] = useState([]);
  // const [selectedNo, setSelectedNo] = useState(0);
  const [selected, setSelected] = useState(data[0]);
  const [searchFilters, updateSearchFilters] = useState([]);
  const [actualFilter, setActualFilter] = useState(null);

  useEffect(() => {
    // searchRef.current.focus();
  }, []);

  const handleChange = (e) => {
    const newValue = e.target.value;
    const filtered = data.filter((value) =>
      newValue.length > 0 ? value.startsWith(newValue) : false
    );
    console.log(filtered);
    fillFilteredValues(filtered);
  };

  //THIS works only for set filter
  const handleKey = (e) => {
    console.log(e.code);
    // ctrlKey: false
    // shiftKey: true
    // altKey: false
    // metaKey: false
    // repeat: false
    // isComposing: false
    // charCode: 13
    // keyCode: 13
    // dispatch({ type: e.nativeEvent.code });
    switch (e.code) {
      case "+":
      case "&":
        return;
      case "|":
      case "*":
        return;
      case "-":
      case "*":
        return;
      case "Tab":
        e.preventDefault();
      case "Enter":
        no = 0;
        if (actualFilter) {
          updateSearchFilters([
            ...searchFilters,
            {
              //TODO: remove actual filter value
              [actualFilter]: searchRef.current.value
            }
          ]);
          searchRef.current.value = searchRef.current.value + "; ";
          setActualFilter(null);
        } else {
          searchRef.current.value = `${filteredValues[no]}: `;
          setActualFilter(filteredValues[no]);
          setSelected(null);
          fillFilteredValues([]);
          searchRef.current.focus();
        }
        return;
      // case "Tab":
      // e.preventDefault();
      // no = 0;
      // searchRef.current.value = `${filteredValues[no]}: `;
      // setSelected(null);
      // fillFilteredValues([]);
      //ACTION: apply filter
      // return;
      // case "Escape":
      //   return state - 1;
      case "ArrowUp":
        no = no === 0 ? filteredValues.length - 1 : no - 1;
        setSelected(filteredValues[no]);
        return;
      case "ArrowDown":
        no = no === filteredValues.length ? 0 : no + 1;
        setSelected(filteredValues[no]);
        return;
      case "Backspace":
        return;
      case "Escape":
        //TODO: set abort flag = true till next command
        setSelected(null);
        fillFilteredValues([]);
        searchRef.current.focus();
        return;
    }
    // console.log(no);
  };

  useEventListener("keydown", handleKey);

  useEffect(() => {
    // console.log("selected", selected);
    // console.log("no", no);
  }, [selected]);

  return (
    <SearchWrapper>
      <Tags>
        {searchFilters.map((value) => {
          // const {key, val} = Objec
          const [key, val] = Object.entries(value);
          return (
            <Filter>
              {key}: {val}
            </Filter>
          );
        })}
        <input type="text" ref={searchRef} onChange={handleChange} />
      </Tags>
      {notices.length && <Notice />}
      {filteredValues.length > 0 && (
        <DropDown values={filteredValues} selected={selected} />
      )}
    </SearchWrapper>
  );
};
