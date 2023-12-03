import React, { useEffect, useState } from "react";
import "./App.css";

import Table from "./components/Table";
import DeleteSelectedButton from "./components/DeleteBtn";
import SearchBar from "./components/SearchBar";
import Pagination from "./components/Pagination";
import Alert from "./components/Alert";
import filterData from "./utils/dataUtils";
import Header from "./components/Header";

const App=()=> {
  const [UsersInfo, setUsersInfo] = useState([]);
  const [searchData, setsearchData] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [EditModal, setEditModal] = useState({
    isModalOpen: false,
    user: {},
  });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const fetchUsersInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      const data = await response.json();
      setLoading(false);
      setUsersInfo(data);
    } catch (error) {
      setLoading(false);
      setError(error);
    }
  };

  
  useEffect(() => {
    fetchUsersInfo();
  }, []);

  
  const handlesearchData = (query) => {
    setsearchData(query);
    setCurrentPage(1);
  };

  
  const filteredData = searchData
    ? filterData(UsersInfo, searchData)
    : UsersInfo;

  
  const handleRowSelect = (row) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(row)
        ? prevSelectedRows.filter((user) => user.id !== row.id)
        : [...prevSelectedRows, row]
    );
  };

  
  function handleAllRowsSelect(currentRows) {
    currentRows?.every((row) => selectedRows.includes(row))
      ? setSelectedRows(
          selectedRows.filter((row) => !currentRows.includes(row))
        )
      : setSelectedRows([
          ...selectedRows,
          ...currentRows.filter((row) => !selectedRows.includes(row)),
        ]);
  }

  
  function handleDeleteRow(row) {
    const updatedUsersInfo = UsersInfo.filter((user) => user.id !== row.id);
    const updatedSelectedRows = selectedRows.filter(
      (user) => user.id !== row.id
    );
    setSelectedRows(updatedSelectedRows);
    setUsersInfo(updatedUsersInfo);
  }

  function handleDeleteSelected() {
    const updatedUsersInfo = UsersInfo.filter(
      (user) => !selectedRows.includes(user)
    );
    setSelectedRows([]);
    setUsersInfo(updatedUsersInfo);
  }

  
  const handleUpdateRowModal = (row) => {
    setEditModal({ isModalOpen: false, user: {} });
    setUsersInfo(UsersInfo.map((user) => (user?.id === row?.id ? row : user)));
  };

  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="main-container">
      <Header />
      <SearchBar
        searchData={searchData}
        handlesearchData={handlesearchData}
      />

      {loading || error ? (
        loading ? (
          <Alert alertType={"loading"} alertMessage={"Loading..."} />
        ) : (
          <Alert alertType={"error"} alertMessage={error.message} />
        )
      ) : (
        <Table
          handleUpdateRowModal={handleUpdateRowModal}
          setEditModal={setEditModal}
          EditModal={EditModal}
          filteredData={filteredData}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          selectedRows={selectedRows}
          handleRowSelect={handleRowSelect}
          handleDeleteRow={handleDeleteRow}
          handleAllRowsSelect={handleAllRowsSelect}
        />
      )}

      <div className="delete-selected-action-container">
        <DeleteSelectedButton
          handleDeleteSelected={handleDeleteSelected}
          selectedRows={selectedRows}
        />
        <div>
          <p className="selected-rows-count-text">
            {selectedRows.length} rows selected
          </p>
        </div>
      </div>
      <Pagination
        rowsPerPage={rowsPerPage}
        totalRows={filteredData.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
}

export default App;
