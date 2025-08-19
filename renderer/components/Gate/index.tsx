import {
  Badge,
  Box,
  Container,
  Divider,
  Flex,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";

import "@mantine/core/styles.css";

export default function Gate() {
  return (
    <Container py="md" fluid bg="var(--mantine-color-blue-light)" size={500}>
      <Stack>
        <Flex gap="md">
          <Paper flex={1} withBorder>
            <Flex>
              <Stack gap={0} w="50%">
                <Box p="md">
                  <Text c="dimmed">Stasiun:</Text>
                  <Text>Pulomas (PUM)</Text>
                </Box>
                <Divider my={0} />
                <Box p="md">
                  <Text c="dimmed">Terminal ID:</Text>
                  <Text>040501 (FLAP, NON-WIDE)</Text>
                </Box>
              </Stack>
              <Box p="md" style={{ borderLeft: "1px solid #e0e0e0" }}>
                <Text c="dimmed">Gate Mode/Direction:</Text>
                <Text>In Service Mode</Text>
                <Text>In</Text>
                <Text>Gate Non Integrasi</Text>
              </Box>
            </Flex>
          </Paper>
          <Paper w="20%" p="sm" withBorder>
            Logo LRT
          </Paper>
        </Flex>
        <Flex gap="md">
          <Paper flex={1} p="sm" withBorder>
            <Box>
              <Text c="dimmed">Status Device:</Text>
              <Flex>
                <Text w="20%">Gate (COM1)</Text>
                <Badge color="green" variant="light" radius="sm">
                  Connected
                </Badge>
              </Flex>
              <Flex>
                <Text w="20%">Reader In</Text>
                <Badge color="yellow" variant="light" radius="sm">
                  (100) SAM Problem
                </Badge>
              </Flex>
              <Flex>
                <Text w="20%">Reader Out</Text>
                <Badge color="red" variant="light" radius="sm">
                  (100) Reader Not detected
                </Badge>
              </Flex>
              <Flex>
                <Text w="20%">Controller (COM 3)</Text>
                <Badge color="gray" variant="light" radius="sm">
                  Disconnected
                </Badge>
              </Flex>
              <Flex>
                <Text w="20%">SNMP</Text>
                <Badge color="gray" variant="light" radius="sm">
                  Disconnect
                </Badge>
              </Flex>
              <Flex>
                <Text w="20%">Server Stasiun</Text>
                <Badge color="green" variant="light" radius="sm">
                  Connected
                </Badge>
              </Flex>
              <Flex>
                <Text w="20%">LIB JLI</Text>
                <Badge color="blue" variant="light" radius="sm">
                  OK (23.4.3-prod)
                </Badge>
              </Flex>
            </Box>
          </Paper>
          <Paper w="40%" p="sm" withBorder>
            <Box>
              <Flex gap="md">
                <Text c="dimmed" style={{ flex: 1 }}>
                  SAM:
                </Text>
                <Text c="dimmed">IN</Text>
                <Text c="dimmed">OUT</Text>
              </Flex>
              <Flex gap="md">
                <Text style={{ flex: 1 }}>LRT</Text>
                <Text>N/A</Text>
                <Text>N/A</Text>
              </Flex>
              <Flex gap="md">
                <Text style={{ flex: 1 }}>BNI</Text>
                <Text>N/A</Text>
                <Text>N/A</Text>
              </Flex>
              <Flex gap="md">
                <Text style={{ flex: 1 }}>BRI</Text>
                <Text>OK</Text>
                <Text>N/A</Text>
              </Flex>
              <Flex gap="md">
                <Text style={{ flex: 1 }}>MANDIRI</Text>
                <Text>N/A</Text>
                <Text>N/A</Text>
              </Flex>
              <Flex gap="md">
                <Text style={{ flex: 1 }}>BCA</Text>
                <Text>OK</Text>
                <Text>N/A</Text>
              </Flex>
              <Flex gap="md">
                <Text style={{ flex: 1 }}>DKI</Text>
                <Text>N/A</Text>
                <Text>N/A</Text>
              </Flex>
              <Flex gap="md">
                <Text style={{ flex: 1 }}>KMT</Text>
                <Text>N/A</Text>
                <Text>N/A</Text>
              </Flex>
            </Box>
          </Paper>
        </Flex>
        <Paper p="sm" withBorder>
          <Group align="center">
            <Box w="70%">
              <Group>
                <Text w="25%">Barcode In (COM 1)</Text>
                <Text>-</Text>
              </Group>
              <Group>
                <Text w="25%">Barcode Out (COM 1)</Text>
                <Text>-</Text>
              </Group>
              <Group>
                <Text w="25%">Server Pusat</Text>
                <Badge color="green" variant="light" radius="sm">
                  Connected
                </Badge>
              </Group>
            </Box>
            <Box>
              <Group>
                <Text>Display In (COM 1)</Text>
                <Text>-</Text>
              </Group>
              <Group>
                <Text>Display Out (COM 1)</Text>
                <Text>-</Text>
              </Group>
            </Box>
          </Group>
        </Paper>
        <Paper p="sm" withBorder>
          <Box>
            <Group>
              <Text w="25%">Server Pusat</Text>
              <Badge color="green" variant="light" radius="sm">
                Connected
              </Badge>
            </Group>
            <Group>
              <Text w="25%">Server Pusat</Text>
              <Badge color="green" variant="light" radius="sm">
                Connected
              </Badge>
            </Group>
            <Group>
              <Text w="25%">Server Pusat</Text>
              <Badge color="green" variant="light" radius="sm">
                Connected
              </Badge>
            </Group>
            <Group>
              <Text w="25%">Server Pusat</Text>
              <Badge color="green" variant="light" radius="sm">
                Connected
              </Badge>
            </Group>
          </Box>
        </Paper>
      </Stack>
    </Container>
  );
}
