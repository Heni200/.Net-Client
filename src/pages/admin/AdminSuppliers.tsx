import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supplierApi } from "../../api/api";
import { Pagination } from "@mui/material";
import styles from "../../Admin.module.css";
import Swal from "sweetalert2";
import LoaderOverlay from "../../shared/componenets/LoaderOverlay";
import { Supplier } from "../../models/supplier";
const AdminSuppliers = () => {
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<any>();
  const navigate = useNavigate();
  const pageSize = 10;

  useEffect(() => {
    getSuppliers();
  }, []);

  function getSuppliers(pageIndex?: number) {
    setLoading(true);
    supplierApi()
      .getAll(pageIndex ?? 1, pageSize)
      .then((res) => {       
        setLoading(false);
        setSuppliers(res.data);
      });
  }

  const AddSupplierClick = () => {
    navigate("/admin/addsupplier");
  };

  const EditSupplierClick = (id: number) => {
    navigate("/admin/addsupplier/" + id);
  };

  function onPageChange(event: any, page: number) {
    getSuppliers(page);
  }

  return (
    <>
      <i
        title="Add Supplier"
        className={`fa fa-plus ${styles.adminAddBtn}`}
        aria-hidden="true"
        onClick={() => AddSupplierClick()}
      ></i>
      <table
        className="table"
        style={{ borderCollapse: "collapse", width: "45%" }}
      >
        <thead>
          <tr>
            <th
              className={`${styles.adminSuppliersTableThLeft} ${styles.adminSuppliersTableTdPadding}`}
            >
              Full Name
            </th>
            <th
              className={`${styles.adminSuppliersTableThLeft} ${styles.adminSuppliersTableTdPadding}`}
            >
              Adresse
            </th>
            <th
              className={`${styles.adminSuppliersTableThLeft} ${styles.adminSuppliersTableTdPadding}`}
            >
              Phone Number
            </th>
            <th className={`${styles.adminSuppliersTableThLeft}`}>Image</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {!loading &&
            suppliers &&
            suppliers.supplierList.length > 0 &&
            suppliers.supplierList.map((item: Supplier, i: number) => {
              return (
                <tr key={item.id}>
                  <td
                    className={`${styles.adminSuppliersTableTd} ${styles.adminSuppliersTableTdPadding}`}
                  >
                    {item.fullName}
                  </td>
                  <td
                    className={`${styles.adminSuppliersTableTd} ${styles.adminSuppliersTableTdPadding}`}
                  >
                    {item.adresse}
                  </td>
                  <td
                    className={`${styles.adminSuppliersTableTd} ${styles.adminSuppliersTableTdPadding}`}
                  >
                    {item.phoneNumber}
                  </td>
                  <td
                    className={`${styles.adminSuppliersTableTd} ${styles.adminSuppliersTableTdPadding}`}
                  >
                  </td>
                  
                  <td
                    style={{ maxWidth: "100px", maxHeight: "100px" }}
                    className={`${styles.adminSuppliersTableTd}`}
                  >
                    {item.imageSrc && (
                      <img
                        className={`${styles.supplierImgAdmin}`}
                        src={"data:image/jpeg;base64," + item.imageSrc}
                        alt={item.fullName}
                        style={{ width: "-webkit-fill-available", height: "-webkit-fill-available" }}

                      />
                    )}
                  </td>
                  <td className={`${styles.adminSuppliersTableTd}`}>
                    <i
                      title="Edit"
                      className={`fa fa-edit ${styles.editBtn}`}
                      onClick={() => EditSupplierClick(Number(item.id))}
                    ></i>
                    <i
                      title="Delete"
                      className={`fa fa-trash ${styles.deleteBtn}`}
                      onClick={() => {
                        Swal.fire({
                          title: "Delete",
                          text: "Are you sure to delete?",
                          icon: "warning",
                          showCancelButton: true,
                        }).then(function (res) {
                          if (res.isConfirmed) {
                            supplierApi()
                              .delete(Number(item.id))
                              .then((resDeleteSupplier) => {                               
                                if (!resDeleteSupplier.data) {
                                  Swal.fire({
                                    title: "Delete",
                                    text: "Can't delete supplier because there are products attached to it.",
                                    icon: "error",
                                  });
                                } else {
                                  navigate({
                                    pathname: "/admin",
                                    search: "?tabIndex=2",
                                  });
                                }
                              });
                          }
                        });
                      }}
                    ></i>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <div style={{ marginTop: "10px" }}>
        {!loading && suppliers?.pager && (
          <span
            style={{
              fontStyle: "italic",
            }}
          >
            {suppliers?.pager?.paginationSummary}
          </span>
        )}
      </div>
      {!loading && suppliers?.pager && (
        <div className="" style={{ float: "left", marginTop: "10px" }}>
          <Pagination
            count={suppliers.pager.totalPages}
            showFirstButton
            showLastButton
            page={suppliers.pager.currentPage}
            onChange={(e, page) => onPageChange(e, page)}
          />
        </div>
      )}
      <LoaderOverlay loading={loading} />
    </>
  );
};

export default AdminSuppliers;
