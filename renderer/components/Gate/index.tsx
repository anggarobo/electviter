import {
  Box,
  Container,
  Divider,
  Flex,
  Paper,
  Stack,
  Text,
} from "@mantine/core";

import "@mantine/core/styles.css";

export default function Gate() {
  return (
    <Container size={500}>
      <Stack>
        <Paper shadow="xs" p="md" withBorder>
          <Flex style={{ border: "1px solid #e0e0e0" }}>
            <Stack>
              <Box p="md">
                <Text>Statiun:</Text>
                <Text>Pulomas (PUM)</Text>
              </Box>
              <Divider />
              <Box p="md">
                <Text>Terminal ID:</Text>
                <Text>040501(FLAP, NON-WIDE)</Text>
              </Box>
            </Stack>
            <Box p="md" style={{ borderLeft: "1px solid #e0e0e0" }}>
              <Text>Gate Mode/Direction:</Text>
              <Text>In Service Mode</Text>
              <Text>In</Text>
              <Text>Gate Non Integrasi</Text>
            </Box>
          </Flex>
        </Paper>
        <Paper shadow="xs" p="sm" withBorder>
          <Box p="md">
            <Text>Status Device:</Text>
            <Text>Gate (COM1) Connected</Text>
            <Text>Reader In (100) SAM Problem</Text>
            <Text>Reader Out (100) Reader Not detected</Text>
            <Text>Controller (COM 3) Disconnected</Text>
            <Text>SNMP Disconnect</Text>
            <Text>Server Stasiun Connected</Text>
            <Text>LIB JLI (OK 23.4.3-prod)</Text>
          </Box>
        </Paper>
      </Stack>

      {/* <Box data-breakout bg="var(--mantine-color-indigo-light)" mt="xs">
                <div>Breakout</div>

                <Box data-container bg="indigo" c="white" h={50}>
                <div>Container inside breakout</div>
                </Box>
            </Box> */}
    </Container>
  );
}
