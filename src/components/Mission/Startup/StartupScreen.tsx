
interface StartupScreenProps {
  onStart: () => void;
  loading: boolean;
  error: string | null;
}

const StartupScreen: React.FC<StartupScreenProps> = ({
  onStart,
  loading,
  error,
}) => {
  return (
    <div className="startup-screen">
      <div className="startup-card glass">
        <div className="startup-header">
          <img
            src="/SARI-LOGO1.png"
            alt="SARI Command Insignia"
            className="startup-logo"
          />
          <h1>{window._env_?.APP_TITLE }</h1>
        </div>

        <p className="startup-copy">
          Engage the telemetry bridge to begin streaming objects from the Unreal
          simulation environment. Ensure the backend service is active before
          starting.
        </p>

        {error && (
          <div className="startup-error-box">
            <p className="startup-error">{error}</p>
          </div>
        )}

        <button
          type="button"
          className="startup-button"
          onClick={onStart}
          disabled={loading}
        >
          {loading ? (
            <span className="loader-text">Connecting to Bridge...</span>
          ) : (
            "Start Scenario"
          )}
        </button>

        <div className="startup-footer">
          <span className="dim">System Version 2.4.0-Alpha</span>
        </div>
      </div>
    </div>
  );
};

export default StartupScreen;
