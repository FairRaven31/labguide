using System.Collections.Generic;
using UnityEngine;
using UnityEngine.XR.ARFoundation;

public class MarkerObjectSpawner : MonoBehaviour
{
    [Header("Prefabs (Match Dropdown Order)")]
    public GameObject digitalMultimeterPrefab;
    public GameObject signalGeneratorPrefab;
    public GameObject functionGeneratorPrefab;
    public GameObject oscilloscopePrefab;
    public GameObject powerSupplyPrefab;
    public GameObject vectorNetworkAnalyzerPrefab;

    private ARTrackedImageManager trackedImageManager;
    private int currentSelection = 0;
    private GameObject spawnedObject;

    void Awake()
    {
        trackedImageManager = GetComponent<ARTrackedImageManager>();
    }

    void OnEnable()
    {
        trackedImageManager.trackablesChanged.AddListener(OnTrackedImagesChanged);
    }

    void OnDisable()
    {
        trackedImageManager.trackablesChanged.RemoveListener(OnTrackedImagesChanged);
    }

    public void ChangeSpawnableObject(int choice)
    {
        currentSelection = choice;

        if (spawnedObject != null)
        {
            Vector3 lastPosition = spawnedObject.transform.position;
            Quaternion lastRotation = spawnedObject.transform.rotation;
            Transform lastParent = spawnedObject.transform.parent;

            Destroy(spawnedObject);
            spawnedObject = Instantiate(GetSelectedPrefab(), lastPosition, lastRotation, lastParent);
        }
    }

    private GameObject GetSelectedPrefab()
    {
        if (currentSelection == 1) return signalGeneratorPrefab;
        if (currentSelection == 2) return functionGeneratorPrefab;
        if (currentSelection == 3) return oscilloscopePrefab;
        if (currentSelection == 4) return powerSupplyPrefab;
        if (currentSelection == 5) return vectorNetworkAnalyzerPrefab;

        return digitalMultimeterPrefab; // Index 0
    }

    private void OnTrackedImagesChanged(ARTrackablesChangedEventArgs<ARTrackedImage> eventArgs)
    {
        foreach (var trackedImage in eventArgs.added)
        {
            if (spawnedObject == null)
            {
                spawnedObject = Instantiate(GetSelectedPrefab(), trackedImage.transform.position, trackedImage.transform.rotation, trackedImage.transform);
            }
        }

        foreach (var trackedImage in eventArgs.updated)
        {
            if (spawnedObject != null)
            {
                spawnedObject.transform.position = trackedImage.transform.position;
                spawnedObject.transform.rotation = trackedImage.transform.rotation;
                spawnedObject.SetActive(trackedImage.trackingState == UnityEngine.XR.ARSubsystems.TrackingState.Tracking);
            }
        }
    }
}