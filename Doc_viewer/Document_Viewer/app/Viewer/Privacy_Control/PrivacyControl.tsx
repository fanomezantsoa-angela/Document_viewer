"use client";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ShieldIcon from "@mui/icons-material/Shield";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import { UseViewMode, type ViewMode } from "./ViewModehook";

const MODES: { value: ViewMode; icon: React.ReactNode; label: string }[] = [
  { value: "full",     icon: <VisibilityIcon fontSize="small" />,    label: "Full view" },
  { value: "redacted", icon: <VisibilityOffIcon fontSize="small" />, label: "Redacted" },
  { value: "summary",  icon: <ShieldIcon fontSize="small" />,        label: "Summary" },
];

export default function PrivacyControl() {
  const { viewMode, setViewMode } = UseViewMode();

  return (
    <ToggleButtonGroup
      value={viewMode}
      exclusive
      onChange={(_e, newMode: ViewMode | null) => {
        if (newMode) setViewMode(newMode);
      }}
      size="small"
    >
      {MODES.map((m) => (
        <Tooltip key={m.value} title={m.label}>
          <ToggleButton value={m.value}>{m.icon}</ToggleButton>
        </Tooltip>
      ))}
    </ToggleButtonGroup>
  );
}
