import React, { Component } from "react";
import PropTypes from "prop-types";
// single dependency is lodash
import _ from "lodash";


const actionTypeSuffix = "##smart-table";


class DataTable extends Component {


  /**
   * Creates an instance of DataTable.
   * @param {Object} props: props object from hoc component
   * @param {Object} context: In case of using Redux, dispatch function will invoke from context.store.dispatch
   *
   */
  constructor(props, context) {
    super(props, context);
    // initialize state fith empy values
    this.state = {
      // actual data for the table to show and sort
      data: [],
      // pagination object that will be store active page number and items to show
      pagination: {
        // passing page number 1 as initial
        activePage: _.defaultTo(_.get(this.props, "pagination.activePage"), 1),
        recordsPerPage: _.get(this.props, "pagination.recordsPerPage")
      },
      // filter value
      filterValue: "",
      // state object that holds which columns is sorted.
      // key names generated based on titles
      // default <th> classes are "default", "asc" and "desc"
      sorted: (() => {
        const obj = {};
        _.map(this.getTitles(), (title, index) =>
          _.set(obj, `${title}`, {
            type: "default",
            index
          })
        );
        return obj;
      })()
    };

    this.watchedPropertiesByDefault = [
      "data",
      "pagination.recordsPerPage",
      "pagination.activePage"
    ];

    // bind inner functions to component
    this.applyPaginationChanges = this.applyPaginationChanges.bind(this);
    this.getActivePageNumber = this.getActivePageNumber.bind(this);
    this.getPaginationItems = this.getPaginationItems.bind(this);
    this.getSlicedData = this.getSlicedData.bind(this);
    this.getTitles = this.getTitles.bind(this);
    this.getTotalPageLength = this.getTotalPageLength.bind(this);
    this.getTotalRecordsLength = this.getTotalRecordsLength.bind(this);
    this.handlePaginationClick = this.handlePaginationClick.bind(this);
    this.handlePaginationNavClick = this.handlePaginationNavClick.bind(this);
    this.handleRecordsPerPageOptions = this.handleRecordsPerPageOptions.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.isPaginationHandledByApi = this.isPaginationHandledByApi.bind(this);
    this.isPaginationVisible = this.isPaginationVisible.bind(this);
    this.update = this.update.bind(this);
  }


  /**
   * initialize state for the first time when component mounted
   *
   */
  componentDidMount() {
    this.update(this.props);
  }


  /**
   * reinitialize component with new props values
   *
   * @param {Object} nextProps: new props values
   *
   */
  componentWillReceiveProps(nextProps) {
    // by default, only this properties are watched.
    // when one of these has changed, component will be updated
    // if you want to pass another property dynmically,
    // you can pass your own props under "watchedProperties" prop key
    const propertiesToBeWatched = _.defaultTo(
      _.get(this.props, "watchedProperties"),
      this.watchedPropertiesByDefault
    );
    // check if one of these has changed
    const areWatchedPropertiesHasChanged = _(propertiesToBeWatched)
      .map(propKey =>
        !_.isEqual(
          _.get(nextProps, propKey),
          _.get(this.props, propKey)
        )
      )
      .values()
      .some();
    // if watched properties changed, update state and render
    if (areWatchedPropertiesHasChanged) {
      this.update(nextProps);
    }
  }


  /**
   * get pagination handle method from props
   *
   * @returns {Boolean}
   *
   */
  isPaginationHandledByApi() {
    return _.defaultTo(
      _.get(this.props, "pagination.handleByApi"),
      false
    );
  }


  /**
   * update state values
   *
   * @param {Object} newState: new state values
   *
   */
  update(newState) {
    const state = {
      // bind data
      data: newState.data,
      // default pagination data
      pagination: _.pick(
        this.isPaginationHandledByApi() ? newState.pagination : this.state.pagination,
        [
          "recordsPerPage",
          "activePage"
        ]
      )
    };
    this.setState(state);
  }


  /**
   * dispatch handler for pagination and sort functions
   * Dispatch function could be retrieved from props with "dispatchFn" attribute or redux store context
   *
   * @param {String} {type}:`##smart-table`/...
   * @param {Object} {payload}: new pagination or sort parameters object
   * @returns none
   */
  dispatchActions({ type, payload }) {

    const dispatchActions = _.defaultTo(
      this.isPaginationHandledByApi(),
      _.get(this.props, "pagination.dispatchActions")
    );
    if (dispatchActions) {
      const dispatchFn = _.get(this, "props.dispatchFn") || _.get(this, "context.store.dispatch") || _.noop;
      // invoke dispatch fn
      dispatchFn({
        type,
        payload
      });
    }
  }


  /**
   * slice data with selected page index for table
   *
   * @param {Array} data
   * @returns {Array}
   *
   */
  getSlicedData(data) {
    // return actual data requested from server
    if (this.isPaginationHandledByApi()) {
      return data;
    }
    else {
      // check if pagination is visible. otherwise, return all items to table
      const recordsPerPage = _.defaultTo(
        _.get(this.state.pagination, "recordsPerPage"),
        _.size(data)
      );
      // return active page items
      return _.slice(
        data,
        (this.getActivePageNumber() - 1) * recordsPerPage,
        this.getActivePageNumber() * recordsPerPage
      );
    }
  }


  /**
   * return new sort type object depeneding on user sort choice
   *
   * @param {Object} oldState: old state
   * @param {String} key: current sort type one of "default", "asc" or "desc"
   * @returns {Object} newState
   *
   */
  changeSortTypes(oldState, key) {
    // clone old state
    const newState = _.cloneDeep(oldState);
    // map titles because of key names generated from titles
    _.map(this.getTitles(), (title) =>
      // set sort object based on key
      _.setWith(newState, [
        "sorted",
        title,
        "type"
        // set new sort type if current sort item matches with clicked title key
      ], key === title ? this.returnNewSortType(_.get(oldState, ["sorted", key, "type"])) : "default")
    );
    // return new state
    return newState;
  }


  /**
   * handle sort function depending on sort type
   *
   * @param {Object} event: click event
   * @param {Object} key: clicked title key
   *
   */
  handleSort(event, key) {
    // old state with new sort type
    const oldState = this.changeSortTypes(this.state, key);
    // index of title which clicked to sort by user
    const indexOfTitle = _.indexOf(this.getTitles(), key);
    // new sorted values by lodash sortBy function
    const sortedValues = _.sortBy(this.props.data, (item, index) => {
      // get column value if passed by values functions on deeply nested row object
      const valuesFn = _.get(this.props, ["values", indexOfTitle]);
      // invoke value function if exist to get value or use key named property value
      return _.isFunction(valuesFn) ? valuesFn(item, index) : _.get(item, _.keys(item)[indexOfTitle]);
    });
    // create empty array for sorted data
    let sortedValuesBySortType = [];
    // get active sort type from state
    const activeSortType = _.get(oldState, ["sorted", key, "type"]);
    // switch case sort types and set sortedValuesBySortType with new array
    switch (activeSortType) {
      case "asc":
        sortedValuesBySortType = sortedValues;
        break;
      case "desc":
        sortedValuesBySortType = _.reverse(sortedValues);
        break;
      case "default":
      default:
        sortedValuesBySortType = this.props.data;
    }
    // do not update state when sort function invoked with no data
    if (_.isEmpty(this.state.data)) {
      return;
    }
    // create new state
    const newState = {
      ...oldState,
      data: sortedValuesBySortType
    };
    // update state with new state
    this.setState(newState);
    // dispatch sort actions with sort type object
    this.dispatchActions({
      type: `${actionTypeSuffix}/TABLE_SORT`,
      payload: newState.sorted
    });
  }


  /**
   * update sort object with new sort type
   *
   * @param {Object} sortedObject: sorted object of state
   * @param {String} key: one of "default", "asc" or "desc"
   * @returns
   *
   */
  handleSortType(sortedObject, key) {
    // return new state object with new sort type
    return _.set(
      {},
      key,
      {
        ..._.get(sortedObject, key),
        type: this.returnNewSortType(sortedObject[key].type)
      }
    );
  }


  /**
   * return new sort object with new sort type
   *
   * @param {String} type: one of  "default", "asc" or "desc"
   * @returns new sortType key
   *
   */
  returnNewSortType(type) {
    // sort types array
    const sortTypes = [
      "default",
      "asc",
      "desc"
    ];
    // find current index
    const activeIndex = _.indexOf(sortTypes, type);
    // return new sort type
    return sortTypes[(activeIndex + 1) % 3];
  }


  /**
   * get titles array from titles prop or object property names
   *
   * @returns {Array}: title array
   *
   */
  getTitles() {
    return _.defaultTo(_.get(this.props, "titles"), _.keys(_.get(this.props, "data[0]")));
  }


  /**
   * get title sort class from props depending on active sort title key
   *
   * @param {Object} sortedState: sorted object state
   * @param {Object} paginationProps: pagination props
   * @param {Object} titleKey: active title key
   * @returns {String} sorted title class
   *
   */
  getTitleSortClass(sortedState, paginationProps, titleKey) {
    return _.defaultTo(
      // if sort classes passed to pagination as props
      _.get(paginationProps, [
        "classList",
        "sortedTitle",
        _.get(sortedState, [titleKey, 'type'])
      ]),
      // otherwise use default class as sort type (one of "default", "asc" or "desc")
      _.get(sortedState, [titleKey, 'type'])
    );
  }


  /**
   * pagination appering state
   *
   * @returns {Boolean}
   *
   */
  isPaginationVisible() {
    return _.has(this, "props.pagination.handleByApi");
  }


  /**
   * update states with new pagination values after user interaction via click event
   *
   * @param {Object} event: Click event object
   * @param {Number} activePage : new page number
   * @returns none
   *
   */
  handlePaginationClick(event, activePage) {
    // prevent default click behaviour
    event.preventDefault();
    // create new pagination state object
    const newPagination = {
      ...this.state.pagination,
      activePage
    };
    // send new values to state using handler
    this.applyPaginationChanges(newPagination);
  }


  /**
   * returns pagination items using maxPaginationItemsToShow from props (default is 10)
   *
   * @returns Array: [3,4,5,6,7]
   * ---------------------|---------
   *----------------active page item
   *
   */
  getPaginationItems() {
    // get pagination values from props
    const activePageNumber = this.getActivePageNumber();
    const totalPage = this.getTotalPageLength();
    const maxPaginationItemsToShow = _.defaultTo(
      _.get(this.props, "pagination.maxPaginationItemsToShow"),
      10,
    );

    const rangeArray = _.range(activePageNumber - Math.ceil(Math.min(maxPaginationItemsToShow, totalPage) / 2), activePageNumber + Math.floor(Math.min(maxPaginationItemsToShow, totalPage) / 2) + (maxPaginationItemsToShow % 2));
    // check if start of array exceeds boundaries
    const diffLast = _.last(rangeArray) - totalPage;
    // check if end of array exceeds boundaries
    const diffHead = -(_.indexOf(rangeArray, 0) + 1);
    // map array with new values with placing active page in the middle of array
    if (diffLast > 0 || diffHead < 0) {
      return _.map(rangeArray, item => item - (diffLast > 0 ? diffLast : diffHead));
    }
    // return original array if array boundaries does not exceeds limits
    return _.isEmpty(rangeArray) ? [1] : rangeArray;
  }



  /**
   * get active page number
   * if pagination is disabled, returns 1 as default
   *
   * @returns {number} page number
   *
   */
  getActivePageNumber() {
    return _.defaultTo(
      _.get(this.state, "pagination.activePage"),
      1
    );
  }


  /**
   *
   *
   * @param {Object} event: clickevent
   * @param {Number} val: desired active pagination number to navigate
   * @param {Number} boundary: first or last page that wanted to be navigated
   *
   */
  handlePaginationNavClick(event, pageNumberOrType) {
    // prevent default click behaviour
    event.preventDefault();
    // get active page and total page number from props
    const { activePage } = this.state.pagination;
    const totalPages = this.getTotalPageLength();
    // check if desired page number is in between of valid range
    // create new pagination state object
    const newPagination = {
      // old pagination state
      ...this.state.pagination,
      // update active page with type of click
      activePage: (() => {
        switch (pageNumberOrType) {
          case "first":
            return 1;
          case "last":
            return totalPages;
          default:
            // if range is valid
            return _.inRange(activePage + pageNumberOrType, 1, totalPages + 1) ? activePage + pageNumberOrType : activePage;
        }
      })()
    };
    // apply new pagination state
    this.applyPaginationChanges(newPagination);
  }


  /**
   * handle selectbox changes that decides how many items will be displayed on one page
   *
   * @param {Object} event: click event
   *
   */
  handleRecordsPerPageOptions(event) {
    // get current pagination values from state
    const totalRecords = this.getTotalRecordsLength();
    const activePage = this.getActivePageNumber();

    // create new pagination state object
    const newPaginationState = {
      ...this.state.pagination,
      recordsPerPage: Number(event.target.value),
      activePage: (totalRecords < Number(event.target.value) * activePage) ? 1 : activePage
    };
    // apply pagination state changes
    this.applyPaginationChanges(newPaginationState);
  }


  /**
   * handle pagination state changes and update state
   *
   * @param {Object} newPagination: new pagination state
   *
   * @memberOf DataTable
   */
  applyPaginationChanges(newPagination) {
    // apply state
    this.setState({
      ...this.state,
      pagination: {
        ...this.state.pagination,
        ...newPagination
      }
    });
    // dispatch new pagination values
    this.dispatchActions({
      type: `${actionTypeSuffix}/PAGINATION_CHANGE`,
      // pick activePage and recordsPerPage properties from pagination state
      payload: _.pick(newPagination, [
        "activePage",
        "recordsPerPage"
      ])
    });
  }


  /**
   * decide total page from props or calculate from data length
   *
   * @returns {Number}
   *
   */
  getTotalPageLength() {
    return this.isPaginationHandledByApi() ?
      _.get(this.props.pagination, "totalPage") :
      Math.ceil(
        _.size(this.props.data) / _.defaultTo(
          _.get(this, "state.pagination.recordsPerPage"),
          _.size(this.props.data)
        )
      );
  }


  /**
   * decide total records length from props or pass from data length
   *
   * @returns {Number}
   *
   */
  getTotalRecordsLength() {
    return this.isPaginationHandledByApi() ?
      _.get(this.props.pagination, "totalRecords") :
      _.defaultTo(_.get(this.props, "pagination.totalPage"), _.size(this.props.data));
  }


  render() {
    const {
      data,
      table,
      info,
      pagination,
      titles,
      formatValues,
      values
    } = this.props;
    return (
      <div className="smart-table">


        <Table
          data={data}
          dataFromState={this.state.data}
          sorted={this.state.sorted}
          pagination={pagination}
          formatValues={formatValues}
          values={values}
          titles={titles}
          table={table}
          getTitleSortClass={this.getTitleSortClass}
          handleSort={this.handleSort}
          getSlicedData={this.getSlicedData} />


        {_.defaultTo(info, true) &&
          <Info
            info={info}
            getTotalRecordsLength={this.getTotalRecordsLength}
            getTotalPageLength={this.getTotalPageLength} />
        }


        {this.isPaginationVisible() &&
          <Pagination
            paginationProps={pagination}
            paginationState={this.state.pagination}
            handlePaginationClick={this.handlePaginationClick}
            handlePaginationNavClick={this.handlePaginationNavClick}
            getActivePageNumber={this.getActivePageNumber}
            handleRecordsPerPageOptions={this.handleRecordsPerPageOptions}
            getPaginationItems={this.getPaginationItems} />
        }


      </div>
    );
  }
}


const elementOrStringPropType = PropTypes.oneOfType([
  PropTypes.element,
  PropTypes.object,
  PropTypes.string,
  PropTypes.node
]);

DataTable.propTypes = {
  data: PropTypes.array,
  debug: PropTypes.bool,
  dispatchActions: PropTypes.bool,
  titles: PropTypes.arrayOf(PropTypes.string),
  values: PropTypes.arrayOf(PropTypes.func),
  formatValues: PropTypes.objectOf(PropTypes.func),
  dispatchFn: PropTypes.func,
  // table
  table: PropTypes.shape({
    classList: PropTypes.shape({
      table: PropTypes.string,
      holder: PropTypes.string
    })
  }),
  // info
  info: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      classList: PropTypes.shape({
        holder: PropTypes.string,
        totalRecords: PropTypes.string,
        totalPage: PropTypes.string
      }),
      totalPageLabel: elementOrStringPropType,
      totalRecordsLabel: elementOrStringPropType
    }).isRequired
  ]),
  // pagination
  pagination: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      totalPage: PropTypes.number,
      recordsPerPage: PropTypes.number,
      recordsPerPageOptions: PropTypes.arrayOf(PropTypes.number.isRequired),
      maxPaginationItemsToShow: PropTypes.number,
      totalRecords: PropTypes.number,
      activePage: PropTypes.number,
      selectLabel: elementOrStringPropType,
      startLabel: elementOrStringPropType,
      prevLabel: elementOrStringPropType,
      nextLabel: elementOrStringPropType,
      endLabel: elementOrStringPropType,
      classList: PropTypes.shape({
        holder: PropTypes.string,
        ul: PropTypes.string,
        activeLi: PropTypes.string,
        label: PropTypes.string,
        select: PropTypes.string,
        selectHolder: PropTypes.string
      })
    })
  ])
};

DataTable.contextTypes = {
  store: PropTypes.object
};

export default DataTable;







const Info = ({
  info,
  getTotalRecordsLength,
  getTotalPageLength
}) =>
  <div className={`smart-table-info ${_.defaultTo(_.get(info, "classList.holder"), "")}`}>
    <p className={`${_.defaultTo(_.get(info, "classList.totalPage"), "")}`}>
      {_.defaultTo(_.get(info, "totalRecordsLabel"), "Total Records:")}
      {getTotalRecordsLength()}
    </p>
    <p className={`${_.defaultTo(_.get(info, "classList.totalRecords"), "")}`}>
      {_.defaultTo(_.get(info, "totalPageLabel"), "Total Pages:")}
      {getTotalPageLength()}
    </p>
  </div>;

Info.propTypes = {
  info: PropTypes.object,
  getTotalRecordsLength: PropTypes.func.isRequired,
  getTotalPageLength: PropTypes.func.isRequired
};


const Pagination = ({
  paginationProps: {
    startLabel,
  prevLabel,
  nextLabel,
  endLabel,
  selectLabel,
  recordsPerPageOptions,
  classList
  },
  paginationState,
  handlePaginationClick,
  handlePaginationNavClick,
  getActivePageNumber,
  handleRecordsPerPageOptions,
  getPaginationItems
}) =>
  <div className={`smart-table-pagination ${_.defaultTo(_.get(classList, "holder"), "")}`}>
    <ul className={_.defaultTo(_.get(classList, "ul"), "")}>
      <li
        onClick={(event) => handlePaginationNavClick(event, "first")}>
        <a href="#">
          {_.defaultTo(startLabel, "◀")}
        </a>
      </li>
      <li
        onClick={(event) => handlePaginationNavClick(event, -1)}>
        <a href="#">
          {_.defaultTo(prevLabel, "❮")}
        </a>
      </li>



      {_.map(getPaginationItems(), (item) =>
        <li
          key={item}
          onClick={(event) => (getActivePageNumber() !== item) && handlePaginationClick(event, item)}
          className={getActivePageNumber() === item ? _.defaultTo(_.get(classList, "activeLi"), 'pagination-active') : ""}>
          <a href="#">{item}</a>
        </li>
      )}



      <li
        onClick={(event) => handlePaginationNavClick(event, +1)}>
        <a href="#">
          {_.defaultTo(nextLabel, "❯")}
        </a>
      </li>
      <li
        onClick={(event) => handlePaginationNavClick(event, "last")}>
        <a href="#">
          {_.defaultTo(endLabel, "▶")}
        </a>
      </li>
    </ul>


    {!_.isUndefined(recordsPerPageOptions) &&
      <div className={_.defaultTo(_.get(classList, "selectHolder"), "")}>
        <label className={_.defaultTo(_.get(classList, "label"), "")}>
          {_.defaultTo(selectLabel, "Records per page:")}
        </label>
        <select
          name="recordsPerPage"
          className={_.defaultTo(_.get(classList, "select"), "")}
          value={paginationState.recordsPerPage}
          onChange={handleRecordsPerPageOptions}
          id="recordsPerPage">
          {
            _.map(_.defaultTo(recordsPerPageOptions, [10, 50]), (item) =>
              <option key={item} value={item}>{item}</option>
            )
          }
        </select>
      </div>
    }


  </div>;

Pagination.propTypes = {
  paginationProps: PropTypes.object.isRequired,
  paginationState: PropTypes.object.isRequired,
  handlePaginationClick: PropTypes.func.isRequired,
  handlePaginationNavClick: PropTypes.func.isRequired,
  getActivePageNumber: PropTypes.func.isRequired,
  handleRecordsPerPageOptions: PropTypes.func.isRequired,
  getPaginationItems: PropTypes.func.isRequired
};





const Table = ({
  dataFromState,
  data,
  table,
  sorted,
  formatValues,
  pagination,
  titles,
  values,
  getTitleSortClass,
  handleSort,
  getSlicedData
}) =>
  <div className={`smart-table-holder ${_.defaultTo(_.get(table, "classList.holder"), "")}`}>
    <table className={_.defaultTo(_.get(table, "classList.table"), "")}>

      <thead>
        <tr>
          {
            _.map(_.defaultTo(titles, _.keys(_.get(data, "[0]"))), (title) =>
              <th
                className={getTitleSortClass(sorted, pagination, title)}
                onClick={() => handleSort(event, title)}
                key={title}>
                <span>{title}</span>
              </th>
            )
          }
        </tr>
      </thead>
      <tbody>
        {
          _.map(getSlicedData(dataFromState), (row, index1) =>
            <tr key={index1}>
              {
                _.map(_.defaultTo(values, row), (column, index2) => {
                  const keyIndex = _.indexOf(_.keys(row), index2);
                  const formatValuesFn = _.defaultTo(
                    _.get(formatValues, keyIndex),
                    _.get(formatValues, index2)
                  );
                  return (
                    <td key={index2}>
                      {
                        _.isFunction(formatValuesFn) ?
                          formatValuesFn(
                            _.isFunction(column) ?
                              column(row) :
                              column
                          ) :
                          (_.isFunction(column) ? column(row) : column)
                      }
                    </td>
                  );
                })
              }
            </tr>
          )
        }
      </tbody>
    </table>
  </div>;

Table.propTypes = {
  dataFromState: PropTypes.array,
  data: PropTypes.array,
  table: PropTypes.object,
  sorted: PropTypes.object.isRequired,
  formatValues: PropTypes.object,
  pagination: PropTypes.object,
  titles: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool
  ]),
  values: PropTypes.array,
  getTitleSortClass: PropTypes.func.isRequired,
  handleSort: PropTypes.func.isRequired,
  getSlicedData: PropTypes.func.isRequired
};

