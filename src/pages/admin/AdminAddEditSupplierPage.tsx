import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { supplierApi } from "../../api/api";
import { Box, TextField, Button, FormControlLabel, Radio } from "@mui/material";
import RadioGroup from "@mui/material/RadioGroup";
import styles from "../../Admin.module.css";
import { Supplier } from "../../models/supplier";
import Swal from "sweetalert2";
import LoaderOverlay from "../../shared/componenets/LoaderOverlay";
import { useParams } from "react-router-dom";

const AdminAddEditSupplier = () => {
  const [name, setName] = useState("");
  const [fontAwsomeClassName, setFontAwsomeClassName] = useState("");
  const [nameInputFocusedFirstTime, setNameInputFocusedFirstTime] = useState(false);
  const [adressInputFocusedFirstTime, setAdressInputFocusedFirstTime] = useState(false);
  const [phoneNumberInputFocusedFirstTime, setPhoneNumberInputFocusedFirstTime] = useState(false);

  const [
    fontAwsomeClassNameInputFocusedFirstTime,
    setFontAwsomeClassNameInputFocusedFirstTime,
  ] = useState(false);
  const [supplierId, setSupplierId] = useState<number>(0);
  const [adresse, setAdresse] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [imageSrc, setImageSrc] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [fontAwsomeOrImage, setFontAwsomeOrImage] = useState("fontAwsome");
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    let id = params?.id;
    if (id) {
      setLoading(true);
      setSupplierId(Number(id));
      supplierApi()
        .getById(Number(id))
        .then((res) => {
          setLoading(false);
          setName(res.data.fullName);
          setPhoneNumber(res.data.phoneNumber);
          setAdresse(res.data.adresse);
          setFontAwsomeClassName(res.data.faClass);
          setImageSrc(res.data.imageSrc);
          if (!res.data.faClass) {
            setFontAwsomeOrImage("image");
          }
        });
    }
  }, []);

  const setAddEditSupplierImageFile = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        let base64Str = reader.result as string;
        base64Str = base64Str
          .replace("data:image/png;base64,", "")
          .replace("data:image/jpeg;base64,", "")
          .replace("data:image/gif;base64,", "");
        setImageSrc(base64Str);
      };
      reader.onerror = function (error) {
        console.log("Error: ", error);
      };
    }
  };

  const redirectToAdminSupplier = () => {
    navigate({
      pathname: "/admin",
      search: "?tabIndex=4",
    });
  };

  const onFontAwsomeAndImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setImageSrc("");
    setFontAwsomeClassName("");
    setFontAwsomeOrImage((event.target as HTMLInputElement).value);
  };

  const handleAddEditSupplier = () => {
    if (!name || (fontAwsomeOrImage === "fontAwsome" && !fontAwsomeClassName)) {
      Swal.fire({
        title: "Error",
        text: "Please fill all the fields",
        icon: "error",
      });
      return;
    } else if (fontAwsomeOrImage === "image" && !imageSrc) {
      Swal.fire({
        title: "Error",
        text: "Please upload image",
        icon: "error",
      });
      return;
    }

    let supplierToAdd: Supplier = {
      id: supplierId ?? 0,
      fullName: name,
      adresse : adresse,
      phoneNumber : phoneNumber,
      imageSrc: imageSrc,
    };

    if (!supplierId) {
      setLoading(true);
      supplierApi()
        .create(supplierToAdd)
        .then((res) => {
          setLoading(false);          
          if (!res.data.success) {
            Swal.fire({
              title: "Image error",
              text: res.data.message,
              icon: "error",
            });
          } else {
            redirectToAdminSupplier();
          }
        });
    } else {
      setLoading(true);
      supplierApi()
        .update(supplierToAdd)
        .then((res) => {
          setLoading(false);
          if (!res.data.success) {
            Swal.fire({
              title: "Image error",
              text: res.data.message,
              icon: "error",
            });
          } else {
            redirectToAdminSupplier();
          }
        });
    }
  };

  return (
    <>
      <Typography variant="h6">
        {!supplierId ? "Add" : "Edit"} supplier:
      </Typography>
      <Box>
        <TextField
          id="name"
          size="small"
          margin="normal"
          required
          type="text"
          label="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          onFocus={() => {
            setNameInputFocusedFirstTime(true);
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "&.MuiInputBase-root fieldset": {
                borderColor:
                  nameInputFocusedFirstTime && name.length === 0
                    ? "red"
                    : "inherit",
              },
            },
          }}
        />
      </Box>
      <Box>
        <TextField
          id="adresse"
          size="small"
          margin="normal"
          required
          type="text"
          label="Adresse"
          value={adresse}
          onChange={(e) => {
            setAdresse(e.target.value);
          }}
          onFocus={() => {
            setAdressInputFocusedFirstTime(true);
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "&.MuiInputBase-root fieldset": {
                borderColor:
                  adressInputFocusedFirstTime && name.length === 0
                    ? "red"
                    : "inherit",
              },
            },
          }}
        />
      </Box>
      <Box>
        <TextField
          id="phoneNumber"
          size="small"
          margin="normal"
          required
          type="text"
          label="PhoneNumber"
          value={phoneNumber}
          onChange={(e) => {
            setPhoneNumber(e.target.value);
          }}
          onFocus={() => {
            setPhoneNumberInputFocusedFirstTime(true);
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "&.MuiInputBase-root fieldset": {
                borderColor:
                  phoneNumberInputFocusedFirstTime && name.length === 0
                    ? "red"
                    : "inherit",
              },
            },
          }}
        />
      </Box>
      <Box>
        <RadioGroup
          row
          value={fontAwsomeOrImage}
          name="row-radio-buttons-group"
          onChange={onFontAwsomeAndImageChange}
        >
          <FormControlLabel
            value="fontAwsome"
            control={<Radio />}
            label="Font awsome class"
          />
          <FormControlLabel
            value="image"
            control={<Radio />}
            label="Upload Image"
          />
        </RadioGroup>
      </Box>
      <Box sx={{ display: fontAwsomeOrImage === "image" ? "block" : "none" }}>
        <label
          htmlFor="imageUploadAddEditProduct"
          className={`${styles.customFileUpload}`}
        >
          <i className="fa fa-cloud-upload"></i> Upload supplier image
        </label>
        <input
          accept="image/png, image/gif, image/jpeg"
          id="imageUploadAddEditProduct"
          type="file"
          className={`${styles.fileUploadHide}`}
          onChange={(e) => setAddEditSupplierImageFile(e)}
        />
        <img
          style={{ display: imageSrc ? "" : "none" }}
          className={`${styles.addProductShowImg}`}
          src={imageSrc ? "data:image/jpeg;base64," + imageSrc : ""}
          alt="productImage"
        />
      </Box>
      <Box sx={{ display: fontAwsomeOrImage !== "image" ? "block" : "none" }}>
        <TextField
          id="fontAwsomeClass"
          size="small"
          margin="normal"
          required
          type="text"
          label="Fa class name"
          value={fontAwsomeClassName}
          onChange={(e) => {
            setFontAwsomeClassName(e.target.value);
          }}
          onFocus={() => {
            setFontAwsomeClassNameInputFocusedFirstTime(true);
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "&.MuiInputBase-root fieldset": {
                borderColor:
                  fontAwsomeClassNameInputFocusedFirstTime &&
                  fontAwsomeClassName.length === 0
                    ? "red"
                    : "inherit",
              },
            },
          }}
        />
      </Box>
      <Box sx={{ marginTop: "15px" }}>
        <Button
          sx={{ marginRight: "55px" }}
          variant="contained"
          color="error"
          onClick={() => {
            redirectToAdminSupplier();
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          type="button"
          onClick={() => handleAddEditSupplier()}
        >
          {supplierId !== 0 && supplierId ? "Save" : "Add"}
        </Button>
      </Box>
      <LoaderOverlay loading={loading} />
    </>
  );
};

export default AdminAddEditSupplier;
