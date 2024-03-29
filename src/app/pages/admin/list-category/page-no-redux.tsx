"use client";

// components next
import { useSession } from "next-auth/react";

// components react
import { useState, useEffect, useRef } from "react";

// components redux
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
// import { fetchCategoriess, Category } from "@/redux/features/categorySlice";

// components
import AddCategory from "../add-category/page";
import UpdateCategory from "../update-category/page";
import SearchCategory from "@/app/components/search-category/searchCategory";
import AuthAdmin from "@/app/components/auth-admin/authAdmin";

// api
import { API } from "@/app/api/api";

// types
import { UserAuth } from "@/types/userAuth";

// alert
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// css
import styles from "./list-category.module.css";
// ----------------------------------------------------------

function ListCategory() {
  const { data: session, status } = useSession();
  const user: UserAuth | undefined = session?.user;

  // state categories
  const [categories, setCategories] = useState<any[]>([]);

  // state data category
  const [dataCategory, setDataCategory] = useState<any>();
 
  // state modal add & update category
  const [modalAddCategory, setModalAddCategory] = useState(false);
  const [modalUpdateCategory, setModalUpdateCategory] = useState(false);

  // State search
  const [search, setSearch] = useState("");

  // state movie found
  const [categoryFound, setCategoryFound] = useState(true);

  // Filtered movie
  const filteredCategories = categories.filter((category) =>
    category?.name.toLowerCase().includes(search.toLowerCase())
  );

  // function close modal add & update categories
  function closeModalAddcategory() {
    setModalAddCategory(false);
    fetchCategories();
    // dispatch(fetchCategoriess());
  }

  function closeModalUpdatecategory() {
    setModalUpdateCategory(false);
    fetchCategories();
    // dispatch(fetchCategoriess());
  }

  // handle delete category
  const handleDeleteCategory = async (id: number) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3E3E3E",
        cancelButtonColor: "#CD2E71",
        confirmButtonText: "Yes!",
        customClass: {
          popup: styles["swal2-popup"],
          title: styles["swal2-title"],
          icon: styles["swal2-icon"],
          confirmButton: styles["swal2-confirm"],
          cancelButton: styles["swal2-cancel"],
        },
      }).then(async (result: any) => {
        if (result.isConfirmed) {
          const config = {
            headers: {
              "Content-type": "multipart/form-data",
              Authorization: "Bearer " + user?.data?.token,
            },
          };

          const res = await API.delete(`/category/${id}`, config);
          if (res.status === 200) {
            toast.success("Category successfully deleted!", {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              theme: "colored",
              style: { marginTop: "65px" },
            });
            fetchCategories();
          }
        }
      });
    } catch (e) {
      console.log("API Error:", e);
      toast.error("Category failed to delete!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
        style: { marginTop: "65px" },
      });
    }
  };

  // handle search
  const handleSearchCategory = (event: any) => {
    setSearch(event.target.value);
    setCategoryFound(true);
  };

  // fetch data categories
  async function fetchCategories() {
    try {
      const moviesData = await getAllCategories();
      setCategories(moviesData.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, [filteredCategories]);

  return (
    <section>
      <AddCategory
        modalAddCategory={modalAddCategory}
        setModalAddCategory={setModalAddCategory}
        closeModalAddcategory={closeModalAddcategory}
        fetchCategories={fetchCategories}
      />
      <UpdateCategory
        modalUpdateCategory={modalUpdateCategory}
        setModalUpdateCategory={setModalUpdateCategory}
        closeModalUpdatecategory={closeModalUpdatecategory}
        fetchCategories={fetchCategories}
        dataCategory={dataCategory}
      />
      <div className="w-full mt-20 px-4 md:px-10 lg:px-20 pb-10">
        <p className="w-full mb-5 font-bold text-2xl text-[#D2D2D2]">
          List Category
        </p>
        <div className="text-right">
          <button
            type="button"
            className="p-2 rounded text-[#D2D2D2] font-bold bg-[#CD2E71] hover:opacity-80"
            onClick={() => setModalAddCategory(true)}
          >
            Add Category
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                <div className="overflow-hidden">
                  <table className="min-w-full text-left text-sm font-light">
                    <thead className="border-b bg-[#0D0D0D] font-medium">
                      <tr>
                        <th
                          scope="col"
                          className="px-2 py-4 text-[#D2D2D2] font-bold text-center"
                        >
                          No
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-[#D2D2D2] font-bold text-center flex items-center"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-[#D2D2D2] font-bold text-center"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <thead className="border-b bg-[#0D0D0D] font-medium">
                      <tr>
                        <th
                          scope="col"
                          className="px-2 text-[#D2D2D2] font-bold text-center"
                        ></th>
                        <th
                          scope="col"
                          className="text-[#D2D2D2] font-bold text-center flex items-center"
                        >
                          <SearchCategory
                            search={search}
                            handleSearchCategory={handleSearchCategory}
                          />
                        </th>
                        <th
                          scope="col"
                          className="py-4 text-[#D2D2D2] font-bold text-center"
                        ></th>
                      </tr>
                    </thead>
                    {filteredCategories.length > 0 ? (
                      filteredCategories?.map((category, i) => {
                        return (
                          <tbody key={i}>
                            <tr className="border-b bg-[#232323]">
                              <td className="whitespace-nowrap px-2 py-4 font-medium text-[#D2D2D2] text-center">
                                {i++ + 1}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-[#D2D2D2] text-left">
                                {category?.name}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-center">
                                <button
                                  type="button"
                                  className="px-2 py-1 rounded-md text-[#D2D2D2] font-bold bg-[#0D0D0D] hover:opacity-80"
                                  onClick={() => {
                                    setModalUpdateCategory(true);
                                    setDataCategory(category);
                                  }}
                                >
                                  Update
                                </button>
                                <span className="text-[#D2D2D2] font-bold mx-2">
                                  |
                                </span>
                                <button
                                  type="button"
                                  className="px-2 py-1 rounded-md text-[#D2D2D2] font-bold bg-[#CD2E71] hover:opacity-80"
                                  onClick={() =>
                                    handleDeleteCategory(category?.id)
                                  }
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        );
                      })
                    ) : (
                      <tbody>
                        <tr className="border-b bg-[#232323] font-medium">
                          <td
                            scope="col"
                            className="px-2 text-[#D2D2D2] text-center"
                          ></td>
                          <td
                            scope="col"
                            className="px-6 py-4 text-[#D2D2D2] text-left"
                          >
                            Name not found
                          </td>
                          <td
                            scope="col"
                            className="py-4 text-[#D2D2D2] text-center"
                          ></td>
                        </tr>
                      </tbody>
                    )}
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AuthAdmin(ListCategory);

async function getAllCategories() {
  const response = await fetch("http://localhost:5000/api/v1/categories", {
    cache: "no-cache",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return await response.json();
}
