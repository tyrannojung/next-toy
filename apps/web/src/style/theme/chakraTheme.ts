import { extendTheme } from "@chakra-ui/theme-utils";
import "@fontsource/poppins";
import "@fontsource/quicksand";
import "@fontsource/quicksand/700.css";
import { Overlay_Index } from "@/types/style/overlayIndex";
const fonts = {
  Poppins: "Poppins",
  Quicksand: "Quicksand",
};

const theme = extendTheme({
  fonts: {
    body: fonts.Poppins,
    Quicksand: fonts.Quicksand,
  },

  breakpoints: {
    base: "0px",
    sm: "360px",
    md: "799px",
    lg: "1200px",
  },

  components: {
    Slider: {
      baseStyle: {
        thumb: {
          bg: "#007AFF",
          transition: "none",
          _active: {
            outline: "none",
            border: "none",
          },
          _focused: {
            outline: "none",
            border: "none",
          },
        },
      },
    },
    Drawer: {
      variants: {
        clickThrough: {
          overlay: {
            pointerEvents: "none",
            background: "transparent",
          },

          dialogContainer: {
            pointerEvents: "none",
            background: "transparent",
          },
          dialog: {
            pointerEvents: "auto",
          },
          input: {
            pointerEvents: "auto",
          },
        },
      },
    },
  },

  styles: {
    global: () => ({
      // Reset all styles
      "*": {
        // all: "unset",
        // animation: "none",
        // transition: "none",
        // transform: "none",
        outline: "none",
        boxshadow: "none",
      },

      "html, body": {
        backgroundColor: "#0F0F12",
        color: "#FFFFFF",
      },
      ".header-right-common": {
        backgroundColor: "#1F2128",
        borderRadius: "8px",
        cursor: "pointer",
      },
      ".card-wrapper": {
        flexDir: "column",
        border: "1px solid #1f2128",
        alignItems: "center",
        pt: "16px",
        borderRadius: "8px",
      },
      ".card": {
        minWidth: "200px",
        minHeight: "248px",
        maxWidth: "200px",
        maxHeight: "248px",
      },
      ".card-empty": {
        border: "1px dashed #313442",
        borderRadius: "16px",
      },
      ".css-17pwl6t": {
        zIndex: Overlay_Index.OverHeader,
      },
    }),
    // Additional overrides for specific components can be added here
    // For example, to reset the button styles
    Button: {
      baseStyle: {
        // Reset button styles
        borderRadius: "none",
        boxShadow: "none",
        fontWeight: "normal",
        _hover: { backgroundColor: "none" },
        _active: {},
        color: "#fff",
      },
    },
    Input: {
      baseStyle: {
        // Reset button styles
        borderRadius: "none",
        boxShadow: "none",
        fontWeight: "normal",
        _hover: { backgroundColor: "none" },
        _active: {},
      },
    },
  },
});

export { theme };
