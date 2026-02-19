export const NODE_CATEGORIES = {
  hardware: {
    label: 'Physical Hardware',
    color: '#3b82f6',
    subtypes: {
      server: { label: 'Server', icon: 'server' },
      switch: { label: 'Switch', icon: 'switch' },
      router: { label: 'Router', icon: 'router' },
      nas: { label: 'NAS', icon: 'nas' },
      ups: { label: 'UPS', icon: 'ups' },
      firewall: { label: 'Firewall', icon: 'firewall' },
    },
  },
  network: {
    label: 'Network',
    color: '#22c55e',
    subtypes: {
      vlan: { label: 'VLAN', icon: 'vlan' },
      subnet: { label: 'Subnet', icon: 'subnet' },
      ip_range: { label: 'IP Range', icon: 'ip' },
    },
  },
  kubernetes: {
    label: 'Kubernetes',
    color: '#a855f7',
    subtypes: {
      namespace: { label: 'Namespace', icon: 'namespace', isGroup: true },
      deployment: { label: 'Deployment', icon: 'deployment' },
      statefulset: { label: 'StatefulSet', icon: 'statefulset' },
      daemonset: { label: 'DaemonSet', icon: 'daemonset' },
      service: { label: 'Service', icon: 'service' },
      ingress: { label: 'Ingress', icon: 'ingress' },
      helmrelease: { label: 'Helm Release', icon: 'helm' },
      configmap: { label: 'ConfigMap', icon: 'configmap' },
      secret: { label: 'Secret', icon: 'secret' },
      pvc: { label: 'PVC', icon: 'pvc' },
    },
  },
  software: {
    label: 'Software',
    color: '#f97316',
    subtypes: {
      container: { label: 'Container', icon: 'container' },
      vm: { label: 'VM', icon: 'vm' },
      application: { label: 'Application', icon: 'app' },
      database: { label: 'Database', icon: 'database' },
    },
  },
};

export function getCategoryForType(type) {
  return NODE_CATEGORIES[type] || null;
}

export function getSubtypeInfo(type, subtype) {
  const category = NODE_CATEGORIES[type];
  if (!category) return null;
  return category.subtypes[subtype] || null;
}

export const PROPERTY_FIELDS = {
  hardware: {
    server: ['hostname', 'cpu', 'ram', 'storage', 'os', 'ip_addresses', 'gpu', 'role'],
    switch: ['hostname', 'ports', 'ip_addresses', 'vlan_support'],
    router: ['hostname', 'ip_addresses', 'wan_ip', 'firmware'],
    nas: ['hostname', 'storage', 'raid_level', 'ip_addresses', 'os'],
    ups: ['model', 'capacity_va', 'runtime_min'],
    firewall: ['hostname', 'ip_addresses', 'firmware', 'rules_count'],
  },
  network: {
    vlan: ['vlan_id', 'subnet', 'gateway', 'description'],
    subnet: ['subnet', 'gateway', 'dns_servers', 'dhcp_range'],
    ip_range: ['start_ip', 'end_ip', 'subnet'],
  },
  kubernetes: {
    namespace: ['namespace'],
    deployment: ['namespace', 'replicas', 'image', 'ports'],
    statefulset: ['namespace', 'replicas', 'image', 'ports', 'storage_class'],
    daemonset: ['namespace', 'image', 'ports'],
    service: ['namespace', 'service_type', 'ports', 'cluster_ip'],
    ingress: ['namespace', 'host', 'paths', 'tls'],
    helmrelease: ['namespace', 'helm_chart', 'helm_version', 'ports'],
    configmap: ['namespace', 'keys'],
    secret: ['namespace', 'keys'],
    pvc: ['namespace', 'storage_class', 'size', 'access_mode'],
  },
  software: {
    container: ['image', 'version', 'ports', 'volumes'],
    vm: ['hypervisor', 'cpu', 'ram', 'storage', 'os', 'ip_addresses'],
    application: ['version', 'port', 'url', 'depends_on'],
    database: ['engine', 'version', 'port', 'size'],
  },
};
