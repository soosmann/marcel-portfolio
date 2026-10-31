import { useState } from "react";
import { Tabs, Tab, Box, useMediaQuery } from "@mui/material";

export default function JobList({ items, sectionId }) {
  const [selectedId, setSelectedId] = useState(items[0]?.id);
  const isMobile = useMediaQuery("(max-width: 700px)");
  const selectedItem = items.find((item) => item.id === selectedId) ?? items[0];
  if (!selectedItem) return <p className="empty-state">Experience details coming soon.</p>;

  return (
    <div className="experience-content">
      <Tabs
        aria-label="Work experience"
        orientation={isMobile ? "horizontal" : "vertical"}
        variant="scrollable"
        scrollButtons="auto"
        value={selectedItem.id}
        onChange={(_, id) => setSelectedId(id)}
        className="experience-tabs"
        sx={{ "& .MuiTabs-indicator": { backgroundColor: "var(--green-bright)" } }}
      >
        {items.map((item) => <Tab
          key={item.id}
          value={item.id}
          label={item.company}
          id={`${sectionId}-tab-${item.id}`}
          aria-controls={`${sectionId}-panel-${item.id}`}
          sx={{
            color: "var(--slate)", fontFamily: "inherit", fontSize: 18,
            textTransform: "none", alignItems: "flex-start", padding: "12px 20px",
            "&.Mui-selected": { color: "var(--green-bright)" },
            "&:hover": { backgroundColor: "var(--green-tint)" },
          }}
        />)}
      </Tabs>
      <Box className="experience-panels">
        {items.map((item) => <div
          key={item.id}
          role="tabpanel"
          id={`${sectionId}-panel-${item.id}`}
          aria-labelledby={`${sectionId}-tab-${item.id}`}
          hidden={selectedItem.id !== item.id}
          tabIndex={0}
        >
          {item.isPlaceholder && <span className="placeholder-label">Experience placeholder</span>}
          <h3 className="joblist-job-title">{item.role} <span className="joblist-job-company">@ {item.company}</span></h3>
          <p className="joblist-duration">{item.period}</p>
          <ul className="job-description">
            {item.description.map((description, index) => <li key={index}>{description}</li>)}
          </ul>
        </div>)}
      </Box>
    </div>
  );
}
