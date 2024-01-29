import { useEffect, useState } from "react";

import { LoadingSvg } from "@assets/LoadingSvg";
import { NewSearchEntry } from "@components";
import axios from "@utils/axios";
import { mutate } from "swr";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useQuery from "@utils/useQuery";

export default function Sidebar() {
  const navigate = useNavigate();
  const { data } = useQuery("/search");
  const [newSearchProcessing, setNewSearchProcessing] = useState(false);
  const [deleteAllProcessing, setDeleteAllProcessing] = useState(false);

  const handleNewSearch = async () => {
    setNewSearchProcessing(true);
    try {
      await axios.post("/search", {
        name: `Search ${data ? data.length + 1 : 1}`,
      });
      await mutate("/search");

      setNewSearchProcessing(false);
      toast.success("New search created");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setNewSearchProcessing(false);
    }
  };

  const handleDeleteAll = async () => {
    try {
      setDeleteAllProcessing(true);
      await axios.delete("/search/all");
      await mutate("/search");
      toast.success("All searches deleted");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setDeleteAllProcessing(false);
    }
  };

  useEffect(() => {
    if (data?.length === 0) {
      handleNewSearch();
    }
  }, []);

  useEffect(() => {
    if (data?.length > 0) {
      const lastItem = data ? data[data.length - 1] : null;
      navigate(`/${lastItem?.name?.toLowerCase()}`, {
        state: lastItem,
      });
    }
  }, [data]);

  return (
    <div className="sidebar">
      <div className="sidear__logo__wrapper">
        <img
          className="sidebar__logo"
          src={
            "https://res.cloudinary.com/arslan0143/image/upload/v1703071529/samples/y3lvf87jviqpzbxcfnyb.png"
          }
        />
      </div>

      <button className="sidebar__btn" onClick={handleNewSearch}>
        {newSearchProcessing ? <LoadingSvg fill="#fff" /> : "New Search"}
      </button>
      <div className="sidebar__search__container">
        {data?.map((item, index) => (
          <NewSearchEntry data={item} index={index} key={item._id} />
        ))}
      </div>
      <button className="sidebar__btn" onClick={handleDeleteAll}>
        {deleteAllProcessing ? <LoadingSvg fill="#fff" /> : "Delete All"}
      </button>
    </div>
  );
}
