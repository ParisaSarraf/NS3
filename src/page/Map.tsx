import { LabelDialog } from "../components/MapComponents/LabelDialog";
import { LayerManager } from "../components/MapComponents/LayerManager";
import { Toolbar } from "../components/MapComponents/Toolbar";
import { useMapManager } from "../hook/useMapManager";

const Map = () => {
  const {
    mapContainer,
    mode,
    features,
    hiddenIds,
    labelInput,
    showLabelDialog,
    setLabelInput,
    setShowLabelDialog,
    setPendingGeom,
    handleModeChange,
    saveGeometry,
    handleFinalSave,
    toggleVisibility,
    deleteFeature,
  } = useMapManager();

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
<<<<<<< HEAD
        direction: "rtl",
=======
        direction: "ltr",
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e
        fontFamily: "Vazirmatn",
      }}
    >
      <div
        ref={mapContainer}
        style={{ width: "100%", height: "100%"}}
      />

      {showLabelDialog && (
        <LabelDialog
          labelInput={labelInput}
          setLabelInput={setLabelInput}
          onCancel={() => {
            setShowLabelDialog(false);
            setPendingGeom(null);
          }}
          onConfirm={handleFinalSave}
        />
      )}

      <Toolbar
        mode={mode}
        handleModeChange={handleModeChange}
        saveGeometry={saveGeometry}
      />

      <LayerManager
        features={features}
        hiddenIds={hiddenIds}
        toggleVisibility={toggleVisibility}
        deleteFeature={deleteFeature}
      />
    </div>
  );
};
export default Map;
