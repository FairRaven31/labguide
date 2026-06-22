using System.Collections.Generic;
using UnityEngine;
using UnityEngine.XR.ARFoundation;
using UnityEngine.XR.ARSubsystems;

public class ARCubePlacer : MonoBehaviour
{
    public GameObject cubePrefab;
    private GameObject spawnedCube;
    private ARRaycastManager raycastManager;
    private List<ARRaycastHit> hits = new List<ARRaycastHit>();

    void Start()
    {
        // Grab the Raycast Manager component from the XR Origin
        raycastManager = GetComponent<ARRaycastManager>();
    }

    void Update()
    {
        // If the cube exists, constantly rotate it
        if (spawnedCube != null)
        {
            spawnedCube.transform.Rotate(Vector3.up, 50f * Time.deltaTime);
        }

        // Check if the user taps the screen
        if (Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Began)
        {
            // Shoot a raycast to see if the tap hit a detected plane
            if (raycastManager.Raycast(Input.GetTouch(0).position, hits, TrackableType.PlaneWithinPolygon))
            {
                Pose hitPose = hits[0].pose;

                // Add 5 centimeters (0.05 units) to the Y axis to make it float
                Vector3 offsetPosition = hitPose.position + new Vector3(0, 0.05f, 0);

                // Place the cube if it hasn't been placed yet, or move it if it has
                if (spawnedCube == null)
                {
                    spawnedCube = Instantiate(cubePrefab, offsetPosition, hitPose.rotation);
                }
                else
                {
                    spawnedCube.transform.position = offsetPosition;
                }
            }
        }
    }
}